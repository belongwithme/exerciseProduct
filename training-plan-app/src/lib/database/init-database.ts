// 数据库初始化脚本
// 用于在Supabase中执行所有SQL文件来建立数据库结构
// 创建日期: 2025-01-27

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // 需要service key来执行管理操作

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ 缺少必要的环境变量:');
    console.error('- VITE_SUPABASE_URL');
    console.error('- SUPABASE_SERVICE_KEY');
    process.exit(1);
}

// 创建Supabase客户端（使用service key）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 读取SQL文件
function readSQLFile(filename: string): string | null {
    try {
        const filePath = join(process.cwd(), 'src/lib/database', filename);
        return readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`❌ 读取文件 ${filename} 失败:`, (error as Error).message);
        return null;
    }
}

// 执行SQL语句
async function executeSQLFile(filename: string, description: string): Promise<boolean> {
    console.log(`📝 正在执行 ${description}...`);
    
    const sql = readSQLFile(filename);
    if (!sql) {
        console.error(`❌ 无法读取 ${filename}`);
        return false;
    }

    try {
        // 将SQL文件分割成单独的语句
        const statements = sql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
            if (statement.trim()) {
                const { error } = await supabase.rpc('exec_sql', { sql: statement });
                if (error) {
                    console.error(`❌ 执行SQL语句失败:`, error);
                    return false;
                }
            }
        }

        console.log(`✅ ${description} 执行成功`);
        return true;
    } catch (error) {
        console.error(`❌ 执行 ${filename} 失败:`, (error as Error).message);
        return false;
    }
}

// 主初始化函数
async function initializeDatabase(): Promise<void> {
    console.log('🚀 开始初始化数据库...\n');

    // 执行顺序很重要，按依赖关系排列
    const tasks = [
        {
            file: 'schema.sql',
            description: '创建数据库表结构'
        },
        {
            file: 'rls-policies.sql',
            description: '设置行级安全策略'
        },
        {
            file: 'seed-data.sql',
            description: '填充初始数据'
        }
    ];

    let success = true;
    for (const task of tasks) {
        const result = await executeSQLFile(task.file, task.description);
        if (!result) {
            success = false;
            break;
        }
        console.log(''); // 添加空行分隔
    }

    if (success) {
        console.log('🎉 数据库初始化完成！');
        console.log('\n📋 已创建的表:');
        console.log('- profiles (用户档案)');
        console.log('- exercises (训练动作)');
        console.log('- workout_plans (训练计划)');
        console.log('- plan_exercises (计划-动作关联)');
        console.log('- workout_logs (训练日志)');
        console.log('- logged_sets (已记录组)');
        console.log('- user_achievements (用户成就)');
        console.log('\n🔒 已设置行级安全策略');
        console.log('📊 已填充系统预设训练动作');
    } else {
        console.log('❌ 数据库初始化失败！');
        process.exit(1);
    }
}

// 检查数据库连接
async function checkConnection(): Promise<boolean> {
    try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error && error.code !== 'PGRST116') { // PGRST116 是表不存在的错误，这是正常的
            console.error('❌ 数据库连接失败:', error.message);
            return false;
        }
        console.log('✅ 数据库连接成功');
        return true;
    } catch (error) {
        console.error('❌ 数据库连接失败:', (error as Error).message);
        return false;
    }
}

// 主执行函数
async function main(): Promise<void> {
    console.log('🔄 检查数据库连接...');
    
    const connected = await checkConnection();
    if (!connected) {
        console.log('\n请确保:');
        console.log('1. Supabase项目已创建');
        console.log('2. 环境变量已正确设置');
        console.log('3. 网络连接正常');
        process.exit(1);
    }

    console.log(''); // 添加空行
    await initializeDatabase();
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { initializeDatabase, checkConnection }; 