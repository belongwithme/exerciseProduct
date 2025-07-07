-- update-workout-plan.sql

CREATE OR REPLACE FUNCTION public.update_workout_plan_with_exercises(
    p_plan_id uuid,
    p_user_id uuid,
    p_plan_name text,
    p_plan_description text,
    p_exercises jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    exercise_record jsonb;
BEGIN
    -- 1. 验证计划是否存在且属于该用户
    IF NOT EXISTS (
        SELECT 1 FROM public.workout_plans
        WHERE id = p_plan_id AND user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'Plan not found or access denied.' USING ERRCODE = 'P0001';
    END IF;

    -- 2. 更新 workout_plans 表
    UPDATE public.workout_plans
    SET
        name = p_plan_name,
        description = p_plan_description,
        updated_at = NOW()
    WHERE id = p_plan_id;

    -- 3. 删除与该计划关联的所有旧的 plan_exercises
    DELETE FROM public.plan_exercises WHERE plan_id = p_plan_id;

    -- 4. 插入新的 plan_exercises
    FOR exercise_record IN SELECT * FROM jsonb_array_elements(p_exercises)
    LOOP
        INSERT INTO public.plan_exercises (
            plan_id,
            exercise_id,
            target_sets,
            target_reps,
            target_weight_kg,
            rest_seconds,
            exercise_order,
            week_number,
            day_of_week,
            notes
        )
        VALUES (
            p_plan_id,
            (exercise_record->>'exercise_id')::uuid,
            (exercise_record->>'target_sets')::integer,
            (exercise_record->>'target_reps')::integer,
            (exercise_record->>'target_weight_kg')::decimal,
            (exercise_record->>'rest_seconds')::integer,
            (exercise_record->>'exercise_order')::integer,
            (exercise_record->>'week_number')::integer,
            (exercise_record->>'day_of_week')::integer,
            exercise_record->>'notes'
        );
    END LOOP;

END;
$$; 