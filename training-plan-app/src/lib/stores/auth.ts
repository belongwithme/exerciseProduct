/**
 * 认证状态管理 Store
 * 
 * 管理用户的认证状态，包括登录、登出、会话管理等功能
 */

import { writable, derived } from 'svelte/store';
import { supabase } from '../utils/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

// 用户会话状态
export const session = writable<Session | null>(null);

// 用户信息（从会话中派生）
export const user = derived(session, ($session) => $session?.user ?? null);

// 用户档案信息
export const userProfile = writable<any>(null);

// 认证加载状态
export const authLoading = writable<boolean>(true);

// 认证错误信息
export const authError = writable<string | null>(null);

// 初始化状态控制 - 防止重复初始化
let isInitialized = false;
let authStateListener: any = null;

/**
 * 获取用户档案信息
 */
async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('获取用户档案失败:', error);
      return null;
    }

    userProfile.set(data);
    return data;
  } catch (error) {
    console.error('获取用户档案错误:', error);
    return null;
  }
}

/**
 * 创建用户档案
 */
async function createUserProfile(userId: string, userData: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          username: userData.username,
          full_name: userData.full_name || userData.username,
          height_cm: userData.height_cm || null,
          weight_kg: userData.weight_kg || null,
          age: userData.age || null,
          gender: userData.gender || null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('创建用户档案失败:', error);
      throw error;
    }

    userProfile.set(data);
    return data;
  } catch (error) {
    console.error('创建用户档案错误:', error);
    throw error;
  }
}

/**
 * 初始化认证状态
 * 获取当前会话并设置认证状态监听
 */
export async function initAuth() {
  // 防止重复初始化
  if (isInitialized) {
    console.log('认证已经初始化，跳过重复初始化');
    return;
  }

  try {
    authLoading.set(true);
    authError.set(null);
    
    console.log('开始初始化认证状态...');

    // 添加超时机制，防止无限等待
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('认证初始化超时')), 10000); // 10秒超时
    });

    // 获取当前会话
    const sessionPromise = supabase.auth.getSession();

    const { data: { session: currentSession }, error } = await Promise.race([
      sessionPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('获取会话失败:', error);
      authError.set(`认证初始化失败: ${error.message}`);
    } else {
      session.set(currentSession);
      console.log('获取会话成功:', currentSession ? '已登录' : '未登录');

      // 如果有会话，获取用户档案
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      }
    }

    // 只在第一次初始化时设置监听器
    if (!authStateListener) {
      authStateListener = supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('认证状态变化:', event, newSession ? '已登录' : '未登录');
        session.set(newSession);

        // 处理不同的认证事件
        if (event === 'SIGNED_IN' && newSession?.user) {
          // 用户登录时，获取或创建用户档案
          let profile = await fetchUserProfile(newSession.user.id);
          
          // 如果档案不存在，尝试从用户元数据创建
          if (!profile && newSession.user.user_metadata) {
            try {
              profile = await createUserProfile(newSession.user.id, newSession.user.user_metadata);
              console.log('自动创建用户档案成功:', profile);
            } catch (error) {
              console.error('自动创建用户档案失败:', error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          // 用户登出时，清除用户档案
          userProfile.set(null);
        }
      });
    }

    isInitialized = true;
    console.log('认证初始化完成');

  } catch (error) {
    console.error('认证初始化错误:', error);
    authError.set(`认证初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
  } finally {
    authLoading.set(false);
  }
}

/**
 * 清理认证资源
 */
export function cleanupAuth() {
  if (authStateListener) {
    authStateListener.data.subscription.unsubscribe();
    authStateListener = null;
  }
  isInitialized = false;
  console.log('认证资源已清理');
}

/**
 * 用户登录
 */
export async function signIn(email: string, password: string) {
  try {
    authLoading.set(true);
    authError.set(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let errorMessage = error.message;
      
      // 提供更友好的错误信息
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = '邮箱或密码错误，请检查后重试';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = '请先确认邮箱后再登录';
      }
      
      authError.set(errorMessage);
      return { success: false, error: errorMessage };
    }

    // 登录成功后获取用户档案
    if (data.user) {
      await fetchUserProfile(data.user.id);
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '登录失败';
    authError.set(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    authLoading.set(false);
  }
}

/**
 * 用户注册
 * @param email 邮箱地址
 * @param password 密码
 * @param userData 用户数据对象
 */
export async function signUp(
  email: string, 
  password: string, 
  userData: {
    username: string;
    full_name?: string;
    height_cm?: number;
    weight_kg?: number;
    age?: number;
    gender?: string;
  }
): Promise<{ success: boolean; message?: string; needsConfirmation?: boolean }> {
  try {
    authLoading.set(true);
    authError.set(null);

    console.log('开始用户注册...', { email, userData });

    // 首先检查用户名是否已存在
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', userData.username)
      .single();

    if (existingProfile) {
      authError.set('用户名已存在，请选择其他用户名');
      return { success: false, message: '用户名已存在，请选择其他用户名' };
    }

    // 使用 Supabase Auth 注册用户
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // 将用户数据传递给 raw_user_meta_data
          username: userData.username,
          full_name: userData.full_name || userData.username,
          height_cm: userData.height_cm,
          weight_kg: userData.weight_kg,
          age: userData.age,
          gender: userData.gender,
        }
      }
    });

    if (error) {
      console.error('注册失败:', error);
      let errorMessage = error.message;
      
      // 提供更友好的错误信息
      if (error.message.includes('User already registered')) {
        errorMessage = '该邮箱已被注册，请使用其他邮箱或直接登录';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = '密码长度至少需要6个字符';
      }
      
      authError.set(errorMessage);
      return { success: false, message: errorMessage };
    }

    if (data.user) {
      console.log('注册成功:', data.user);
      
      // 如果用户已确认邮箱（即时确认），直接创建档案
      if (data.session) {
        session.set(data.session);
        try {
          await createUserProfile(data.user.id, userData);
          console.log('用户档案创建成功');
        } catch (profileError) {
          console.error('创建用户档案失败:', profileError);
          // 即使档案创建失败，注册仍然成功
        }
        return { 
          success: true, 
          message: '注册成功！欢迎使用训练计划系统。' 
        };
      } else {
        // 需要邮箱确认
        return { 
          success: true, 
          message: '注册成功！请检查邮箱并点击确认链接完成注册。',
          needsConfirmation: true
        };
      }
    }

    return { success: false, message: '注册失败，请稍后重试' };
  } catch (error) {
    console.error('注册过程中发生错误:', error);
    const errorMessage = error instanceof Error ? error.message : '注册失败，请稍后重试';
    authError.set(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    authLoading.set(false);
  }
}

/**
 * 用户登出
 */
export async function signOut() {
  try {
    authLoading.set(true);
    authError.set(null);

    const { error } = await supabase.auth.signOut();

    if (error) {
      authError.set(error.message);
      return { success: false, error: error.message };
    }

    // 清除用户档案
    userProfile.set(null);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '登出失败';
    authError.set(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    authLoading.set(false);
  }
}

/**
 * 重置密码
 */
export async function resetPassword(email: string) {
  try {
    authLoading.set(true);
    authError.set(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`
    });

    if (error) {
      authError.set(error.message);
      return { success: false, error: error.message };
    }

    return { success: true, message: '重置密码邮件已发送，请检查邮箱' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '重置密码失败';
    authError.set(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    authLoading.set(false);
  }
}

/**
 * 更新用户档案
 */
export async function updateUserProfile(updates: any) {
  try {
    const currentSession = await supabase.auth.getSession();
    if (!currentSession.data.session?.user) {
      throw new Error('用户未登录');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', currentSession.data.session.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    userProfile.set(data);
    return { success: true, data };
  } catch (error) {
    console.error('更新用户档案失败:', error);
    const errorMessage = error instanceof Error ? error.message : '更新失败';
    return { success: false, error: errorMessage };
  }
}

/**
 * 清除认证错误
 */
export function clearAuthError() {
  authError.set(null);
} 