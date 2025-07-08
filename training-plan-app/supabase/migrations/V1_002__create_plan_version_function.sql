CREATE OR REPLACE FUNCTION create_plan_version(p_plan_id bigint, p_content jsonb)
RETURNS int
LANGUAGE plpgsql
-- SECURITY DEFINER 告诉 PostgreSQL 以定义者的权限执行此函数
-- 这在需要访问受RLS保护的表时是必要的，同时我们在函数内部自己处理权限检查
SET search_path = public
SECURITY DEFINER
AS $$
DECLARE
  new_version_number int;
  plan_owner_id uuid;
BEGIN
  -- 步骤 1: 验证调用者是否为该训练计划的所有者
  -- 这是一个关键的安全检查，防止用户修改不属于自己的计划
  SELECT user_id INTO plan_owner_id FROM workout_plans WHERE id = p_plan_id;

  -- 如果找不到计划，则抛出错误
  IF plan_owner_id IS NULL THEN
    RAISE EXCEPTION 'Workout plan with id % not found', p_plan_id;
  END IF;

  -- 如果计划的所有者与当前认证的用户不匹配，则拒绝操作
  IF plan_owner_id != auth.uid() THEN
    RAISE EXCEPTION 'User does not have permission to update this plan. UID % does not match owner %', auth.uid(), plan_owner_id;
  END IF;

  -- 步骤 2: 以原子方式更新主计划表的版本号，并立即返回新的版本号
  -- 使用 RETURNING 子句可以确保我们获取到的是最新的、已成功提交的版本号
  UPDATE workout_plans
  SET version = version + 1
  WHERE id = p_plan_id
  RETURNING version INTO new_version_number;

  -- 步骤 3: 在版本历史表中插入新的快照记录
  -- 这条记录包含了计划ID、新的版本号以及计划内容的完整JSONB快照
  INSERT INTO workout_plan_versions (plan_id, version_number, content)
  VALUES (p_plan_id, new_version_number, p_content);

  -- 步骤 4: 返回新创建的版本号，以便前端可以进行后续操作
  RETURN new_version_number;
END;
$$;

-- ============================================================================
-- 新增函数：revert_to_plan_version - 处理计划版本恢复逻辑
-- ============================================================================

CREATE OR REPLACE FUNCTION revert_to_plan_version(p_plan_id bigint, p_target_version_number int)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
SECURITY DEFINER
AS $$
DECLARE
  plan_owner_id uuid;
  target_content jsonb;
  new_version_number int;
  revert_content jsonb;
BEGIN
  -- 步骤 1: 验证调用者是否为该训练计划的所有者
  SELECT user_id INTO plan_owner_id FROM workout_plans WHERE id = p_plan_id;

  -- 如果找不到计划，则抛出错误
  IF plan_owner_id IS NULL THEN
    RAISE EXCEPTION 'Workout plan with id % not found', p_plan_id;
  END IF;

  -- 如果计划的所有者与当前认证的用户不匹配，则拒绝操作
  IF plan_owner_id != auth.uid() THEN
    RAISE EXCEPTION 'User does not have permission to revert this plan. UID % does not match owner %', auth.uid(), plan_owner_id;
  END IF;

  -- 步骤 2: 获取目标版本的内容
  SELECT content INTO target_content 
  FROM workout_plan_versions 
  WHERE plan_id = p_plan_id AND version_number = p_target_version_number;

  -- 如果找不到目标版本，则抛出错误
  IF target_content IS NULL THEN
    RAISE EXCEPTION 'Target version % not found for plan %', p_target_version_number, p_plan_id;
  END IF;

  -- 步骤 3: 首先保存当前状态作为一个新版本（用于恢复前的备份）
  -- 获取当前计划的内容并保存为新版本
  SELECT jsonb_build_object(
    'exercises', 
    jsonb_agg(
      jsonb_build_object(
        'exercise_id', pe.exercise_id,
        'target_sets', pe.target_sets,
        'target_reps', pe.target_reps,
        'notes', pe.notes
      )
    )
  ) INTO revert_content
  FROM plan_exercises pe
  WHERE pe.plan_id = p_plan_id;

  -- 更新计划版本号并创建备份版本
  UPDATE workout_plans
  SET version = version + 1
  WHERE id = p_plan_id
  RETURNING version INTO new_version_number;

  -- 插入备份版本（标记为恢复前的状态）
  INSERT INTO workout_plan_versions (plan_id, version_number, content)
  VALUES (p_plan_id, new_version_number, 
          jsonb_build_object(
            'type', 'backup_before_revert',
            'reverted_from_version', p_target_version_number,
            'backup_content', revert_content
          ));

  -- 步骤 4: 删除当前的 plan_exercises 记录
  DELETE FROM plan_exercises WHERE plan_id = p_plan_id;

  -- 步骤 5: 根据目标版本的内容重新创建 plan_exercises 记录
  -- 假设 target_content 的结构为 { "exercises": [...] }
  INSERT INTO plan_exercises (plan_id, exercise_id, target_sets, target_reps, notes)
  SELECT 
    p_plan_id,
    (exercise->>'exercise_id')::bigint,
    (exercise->>'target_sets')::int,
    exercise->>'target_reps',
    exercise->>'notes'
  FROM jsonb_array_elements(target_content->'exercises') AS exercise;

  -- 步骤 6: 再次更新版本号并创建恢复后的版本记录
  UPDATE workout_plans
  SET version = version + 1
  WHERE id = p_plan_id
  RETURNING version INTO new_version_number;

  -- 插入恢复操作的记录
  INSERT INTO workout_plan_versions (plan_id, version_number, content)
  VALUES (p_plan_id, new_version_number, 
          jsonb_build_object(
            'type', 'reverted_to',
            'source_version', p_target_version_number,
            'reverted_content', target_content
          ));

  -- 步骤 7: 返回操作结果
  RETURN jsonb_build_object(
    'success', true,
    'plan_id', p_plan_id,
    'reverted_to_version', p_target_version_number,
    'new_version_number', new_version_number,
    'message', format('Successfully reverted plan %s to version %s', p_plan_id, p_target_version_number)
  );
END;
$$; 