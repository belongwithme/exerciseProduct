import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // 使用 dotenv 加载 .env 文件中的环境变量
import { readFileSync } from 'fs';
import { join } from 'path';

// 从环境变量中获取 Supabase 的配置
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.PUBLIC_SUPABASE_SERVICE_KEY; // 需要使用 service_role key

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ 错误: 缺少 Supabase 环境变量 (PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_SERVICE_KE)');
	process.exit(1);
}

// 创建一个具有管理员权限的 Supabase 客户端
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * @description 将外部 API 的数据结构映射到我们数据库的表结构
 * @param {any} exercise - 从外部 API 获取的单个训练动作数据
 * @returns {object} - 符合我们 `exercises` 表结构的对豰
 */
const mapDataToSchema = (exercise: any) => {
    // 我们的数据库字段: name, description, muscle_group, equipment, video_url
    // exercemus 数据字段: name, description, primary_muscles, equipment, video
    return {
        name: exercise.name,
        description: exercise.description || '暂无描述', // 提供默认值
        muscle_group: exercise.primary_muscles.join(', ') || '综合', // 将肌肉数组合并为字符串
        equipment: exercise.equipment.join(', ') || '自重', // 将器械数组合并为字符串
        // 有些 video 是数组，有些是字符串，这里做兼容处理
        video_url: Array.isArray(exercise.video) ? exercise.video[0] : exercise.video,
    };
};

/**
 * @description 主函数，用于获取、转换和插入训练动作数据
 */
async function populateExercises() {
	console.log('🚀 开始填充训练动作数据...');

	try {
        // 1. 清空现有的 `exercises` 表，以避免重复插入
        console.log('🗑️ 正在清空旧的训练动作数据...');
        // 使用 TRUNCATE ... CASCADE 通过 RPC 调用来清空表。
        // 这比 DELETE 更高效，且 CASCADE 会自动处理所有外键关联，
        // 从而绕过因 RLS 策略导致的复杂类型转换错误。
        const { error: deleteError } = await supabaseAdmin.rpc('exec_sql', { 
            sql: 'TRUNCATE public.exercises RESTART IDENTITY CASCADE' 
        });

        if (deleteError) {
            console.error('❌ 清空数据失败:', deleteError);
            return;
        }
        console.log('✅ 旧数据已清空。');

		// 2. 从本地文件读取原始 JSON 数据
        const filePath = join(process.cwd(), 'src', 'lib', 'database', 'data', 'exercises.json');
		console.log(`📄 正在从本地文件 ${filePath} 读取数据...`);

		const fileContent = readFileSync(filePath, 'utf-8');
		const data = JSON.parse(fileContent);
        const exercises = data.exercises;
		console.log(`✅ 成功读取 ${exercises.length} 条训练动作数据。`);

		// 3. 映射数据到我们的数据库表结构
		console.log('🔄 正在转换数据格式...');
		const formattedExercises = exercises.map(mapDataToSchema).filter((ex: any) => ex.name);
		console.log(`✅ 数据转换完成，共 ${formattedExercises.length} 条有效数据。`);

		// 4. 将格式化后的数据分批插入到 Supabase
		console.log('✍️ 正在将数据写入数据库...');
        const batchSize = 100; // 设置每批插入的数量
        for (let i = 0; i < formattedExercises.length; i += batchSize) {
            const batch = formattedExercises.slice(i, i + batchSize);
            const { error: insertError } = await supabaseAdmin.from('exercises').insert(batch);

            if (insertError) {
                console.error(`❌ 批次 ${i / batchSize + 1} 插入失败:`, insertError);
                // 如果需要，可以中断循环
                // break; 
            } else {
                console.log(`✅ 批次 ${i / batchSize + 1} 插入成功。`);
            }
        }

		console.log('🎉 训练动作数据填充成功！');
	} catch (error) {
		console.error('❌ 数据填充过程中发生错误:', error);
	}
}

// 执行主函数
populateExercises(); 