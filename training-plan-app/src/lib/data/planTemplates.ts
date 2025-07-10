// 训练计划模板数据
export interface PlanTemplate {
	id: string;
	name: string;
	description: string;
	category: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'rehabilitation';
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	duration_weeks: number;
	sessions_per_week: number;
	exercises: TemplateExercise[];
	tags: string[];
	preview_image?: string;
}

export interface TemplateExercise {
	exercise_id: string;
	target_sets: number;
	target_reps: number;
	target_weight_kg?: number;
	notes?: string;
	exercise_order: number;
	day_of_week: number;
	rest_seconds?: number;
}

// 预设模板数据
export const planTemplates: PlanTemplate[] = [
	{
		id: 'beginner-strength',
		name: '新手力量训练',
		description: '适合初学者的基础力量训练计划，注重基本动作模式的学习',
		category: 'strength',
		difficulty: 'beginner',
		duration_weeks: 8,
		sessions_per_week: 3,
		tags: ['力量', '初学者', '基础', '全身'],
		exercises: [
			{
				exercise_id: '1', // 需要根据实际数据库中的动作ID调整
				target_sets: 3,
				target_reps: 12,
				target_weight_kg: 0,
				notes: '注重动作质量，重量从轻开始',
				exercise_order: 1,
				day_of_week: 1,
				rest_seconds: 60
			},
			// 更多动作...
		]
	},
	{
		id: 'jump-training',
		name: '弹跳力提升',
		description: '专注于提升弹跳力和爆发力的综合训练计划',
		category: 'sports',
		difficulty: 'intermediate',
		duration_weeks: 12,
		sessions_per_week: 4,
		tags: ['弹跳', '爆发力', '运动表现', '下肢'],
		exercises: [
			// 跳跃相关动作
		]
	},
	{
		id: 'upper-body-strength',
		name: '上肢力量强化',
		description: '重点训练上肢肌群，提升推拉力量',
		category: 'strength',
		difficulty: 'intermediate',
		duration_weeks: 10,
		sessions_per_week: 3,
		tags: ['上肢', '力量', '推拉', '肌肉'],
		exercises: [
			// 上肢训练动作
		]
	}
];

// 根据类别获取模板
export function getTemplatesByCategory(category: PlanTemplate['category']): PlanTemplate[] {
	return planTemplates.filter(template => template.category === category);
}

// 根据难度获取模板
export function getTemplatesByDifficulty(difficulty: PlanTemplate['difficulty']): PlanTemplate[] {
	return planTemplates.filter(template => template.difficulty === difficulty);
}

// 根据标签搜索模板
export function searchTemplatesByTag(tag: string): PlanTemplate[] {
	return planTemplates.filter(template => 
		template.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
	);
} 