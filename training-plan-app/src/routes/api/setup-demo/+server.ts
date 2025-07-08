import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		return json({ error: '请先登录' }, { status: 401 });
	}

	const userId = session.user.id;

	try {
		// 检查用户是否已经有训练计划
		const { data: existingPlans, error: checkError } = await supabase
			.from('workout_plans')
			.select('id')
			.eq('user_id', userId)
			.limit(1);

		if (checkError) {
			console.error('检查现有计划失败:', checkError);
			return json({ error: '检查现有数据失败' }, { status: 500 });
		}

		if (existingPlans && existingPlans.length > 0) {
			return json({ error: '您已经有训练计划了，无需重复创建' }, { status: 400 });
		}

		// 创建三个训练计划
		const plans = [
			{
				user_id: userId,
				name: '第一阶段：基础重建',
				description: '建立基础力量和稳定性，为后续训练做准备。重点关注基础动作模式的掌握和身体控制能力的提升。',
				plan_type: 'strength',
				difficulty_level: 2,
				duration_weeks: 4,
				sessions_per_week: 3,
				is_public: false
			},
			{
				user_id: userId,
				name: '第二阶段：力量发展',
				description: '在基础稳定的前提下，重点发展最大力量。通过渐进式负荷增加，提升整体力量水平。',
				plan_type: 'strength',
				difficulty_level: 3,
				duration_weeks: 6,
				sessions_per_week: 4,
				is_public: false
			},
			{
				user_id: userId,
				name: '第三阶段：爆发力提升',
				description: '将力量转化为爆发力，重点训练快速力量输出。结合弹跳训练，提升垂直跳跃能力。',
				plan_type: 'plyometric',
				difficulty_level: 4,
				duration_weeks: 8,
				sessions_per_week: 4,
				is_public: false
			}
		];

		const { data: createdPlans, error: planError } = await supabase
			.from('workout_plans')
			.insert(plans)
			.select('id, name');

		if (planError) {
			console.error('创建训练计划失败:', planError);
			return json({ error: '创建训练计划失败' }, { status: 500 });
		}

		// 为每个计划添加训练动作
		const planExercises = [];

		// 第一阶段的训练动作
		const stage1Plan = createdPlans.find(p => p.name === '第一阶段：基础重建');
		if (stage1Plan) {
			const stage1Exercises = [
				{ exerciseName: '深蹲', sets: 3, reps: '8-12', notes: '重点关注动作质量，不要追求重量', order: 1 },
				{ exerciseName: '俯卧撑', sets: 3, reps: '10-15', notes: '如果标准俯卧撑困难，可以从跪姿开始', order: 2 },
				{ exerciseName: '平板支撑', sets: 3, reps: '30-60秒', notes: '保持身体一条直线，避免塌腰', order: 3 },
				{ exerciseName: '保加利亚分腿蹲', sets: 3, reps: '6-10', notes: '每侧腿，重点训练单腿稳定性', order: 4 }
			];

			for (const ex of stage1Exercises) {
				const { data: exercise } = await supabase
					.from('exercises')
					.select('id')
					.eq('name', ex.exerciseName)
					.single();

				if (exercise) {
					planExercises.push({
						plan_id: stage1Plan.id,
						exercise_id: exercise.id,
						target_sets: ex.sets,
						target_reps: ex.reps,
						notes: ex.notes,
						order_index: ex.order
					});
				}
			}
		}

		// 第二阶段的训练动作
		const stage2Plan = createdPlans.find(p => p.name === '第二阶段：力量发展');
		if (stage2Plan) {
			const stage2Exercises = [
				{ exerciseName: '深蹲', sets: 4, reps: '5-8', notes: '增加负重，重点发展最大力量', order: 1 },
				{ exerciseName: '卧推', sets: 4, reps: '5-8', notes: '渐进式增加重量，注意安全', order: 2 },
				{ exerciseName: '引体向上', sets: 3, reps: '3-8', notes: '如需要可使用弹力带辅助', order: 3 },
				{ exerciseName: '杠铃划船', sets: 4, reps: '6-10', notes: '保持背部挺直，专注于肩胛骨收缩', order: 4 },
				{ exerciseName: '肩上推举', sets: 3, reps: '6-10', notes: '核心保持稳定，避免弓背', order: 5 }
			];

			for (const ex of stage2Exercises) {
				const { data: exercise } = await supabase
					.from('exercises')
					.select('id')
					.eq('name', ex.exerciseName)
					.single();

				if (exercise) {
					planExercises.push({
						plan_id: stage2Plan.id,
						exercise_id: exercise.id,
						target_sets: ex.sets,
						target_reps: ex.reps,
						notes: ex.notes,
						order_index: ex.order
					});
				}
			}
		}

		// 第三阶段的训练动作
		const stage3Plan = createdPlans.find(p => p.name === '第三阶段：爆发力提升');
		if (stage3Plan) {
			const stage3Exercises = [
				{ exerciseName: '深蹲跳', sets: 4, reps: '5-8', notes: '专注于向上的爆发力，轻柔落地', order: 1 },
				{ exerciseName: '箱式跳跃', sets: 3, reps: '3-5', notes: '选择适合的箱子高度，确保安全', order: 2 },
				{ exerciseName: '波比跳', sets: 3, reps: '8-12', notes: '高强度动作，注意休息间隔', order: 3 },
				{ exerciseName: '立定跳远', sets: 3, reps: '3-5', notes: '充分摆臂，专注于水平爆发力', order: 4 },
				{ exerciseName: '单腿深蹲', sets: 2, reps: '3-5', notes: '每侧腿，高难度动作，循序渐进', order: 5 }
			];

			for (const ex of stage3Exercises) {
				const { data: exercise } = await supabase
					.from('exercises')
					.select('id')
					.eq('name', ex.exerciseName)
					.single();

				if (exercise) {
					planExercises.push({
						plan_id: stage3Plan.id,
						exercise_id: exercise.id,
						target_sets: ex.sets,
						target_reps: ex.reps,
						notes: ex.notes,
						order_index: ex.order
					});
				}
			}
		}

		// 插入计划动作关联数据
		if (planExercises.length > 0) {
			const { error: exerciseError } = await supabase
				.from('plan_exercises')
				.insert(planExercises);

			if (exerciseError) {
				console.error('创建计划动作关联失败:', exerciseError);
				return json({ error: '创建训练动作失败' }, { status: 500 });
			}
		}

		return json({ 
			success: true, 
			message: '示例训练计划创建成功！',
			plansCreated: createdPlans.length,
			exercisesAdded: planExercises.length
		});

	} catch (error) {
		console.error('创建示例数据时发生错误:', error);
		return json({ error: '服务器内部错误' }, { status: 500 });
	}
}; 