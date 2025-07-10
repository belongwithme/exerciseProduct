/**
 * 认证状态管理 Store
 * 
 * 使用 Svelte stores 管理用户认证状态，包括登录、登出、注册等功能
 */

import { writable, derived } from 'svelte/store';
import { invalidate } from '$app/navigation';
import { browser } from '$app/environment';
import type { User, Session, AuthError, SupabaseClient } from '@supabase/supabase-js';

// 定义用户profile接口
export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  // 基本身体数据
  height_cm?: number;
  weight_kg?: number;
  birth_date?: string;
  gender?: string;
  experience_level?: string;
  goals?: string;
  bio?: string;
  // 弹跳相关数据
  standing_reach_cm?: number;
  max_touch_height_cm?: number;
  target_touch_height_cm?: number;
  // 力量数据
  bench_press_kg?: number;
  squat_kg?: number;
  deadlift_kg?: number;
}

// 认证状态接口
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

// 创建初始状态
const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null
};

// 创建认证状态 store
export const authState = writable<AuthState>(initialState);

// 用户 store（从认证状态派生）
export const user = derived(authState, ($authState) => $authState.user);

// 会话 store（从认证状态派生）
export const session = derived(authState, ($authState) => $authState.session);

// 加载状态 store
export const authLoading = derived(authState, ($authState) => $authState.loading);

// 错误状态 store
export const authError = derived(authState, ($authState) => $authState.error);

// 用户配置文件 store
export const userProfile = writable<UserProfile | null>(null);

// Supabase 客户端实例（由 layout 设置）
let supabaseClient: SupabaseClient | null = null;

/**
 * 设置 Supabase 客户端实例
 * 这个函数由 +layout.svelte 调用
 */
export function setSupabaseClient(client: SupabaseClient) {
  supabaseClient = client;
}

/**
 * 获取 Supabase 客户端
 */
function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized. Call setSupabaseClient() first.');
  }
  return supabaseClient;
}

/**
 * 初始化认证状态
 * 检查当前会话并设置认证监听器
 */
export async function initAuth(initialSession?: Session | null): Promise<void> {
  if (!browser) return; // 只在客户端运行
  
  try {
    const supabase = getSupabaseClient();
    
    // 如果有初始会话，直接使用
    if (initialSession) {
      authState.update(state => ({
        ...state,
        user: initialSession.user || null,
        session: initialSession,
        loading: false,
        error: null
      }));

      if (initialSession.user) {
        await loadUserProfile(initialSession.user.id);
      }
    } else {
      // 获取当前会话
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('获取会话错误:', error);
        authState.update(state => ({
          ...state,
          error: error.message,
          loading: false
        }));
        return;
      }

      // 更新认证状态
      authState.update(state => ({
        ...state,
        user: session?.user || null,
        session: session,
        loading: false,
        error: null
      }));

      // 如果有用户，加载用户配置文件
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    }

    // 监听认证状态变化
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('认证状态变化:', event, session?.user?.email);
      
      authState.update(state => ({
        ...state,
        user: session?.user || null,
        session: session,
        loading: false,
        error: null
      }));

      // 根据事件处理用户配置文件
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        userProfile.set(null);
      }

      // 通知 SvelteKit 重新验证所有依赖于 supabase:auth 的加载函数
      await invalidate('supabase:auth');
    });

  } catch (error) {
    console.error('初始化认证错误:', error);
    authState.update(state => ({
      ...state,
      error: '认证初始化失败',
      loading: false
    }));
  }
}

/**
 * 加载用户配置文件
 */
async function loadUserProfile(userId: string): Promise<void> {
  try {
    console.log('🔍 开始加载用户配置文件, userId:', userId);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('📊 用户配置文件查询结果:', { data, error });

    if (error && error.code !== 'PGRST116') { // 忽略"行未找到"错误
      console.error('❌ 加载用户配置文件错误:', error);
      return;
    }

    if (data) {
      console.log('✅ 用户配置文件加载成功:', data);
      userProfile.set(data);
    } else {
      console.log('⚠️ 用户配置文件不存在，可能是新用户');
      // 为新用户创建基础profile记录
      await createInitialProfile(userId);
    }
  } catch (error) {
    console.error('💥 加载用户配置文件异常:', error);
  }
}

/**
 * 为新用户创建初始配置文件
 */
async function createInitialProfile(userId: string): Promise<void> {
  try {
    console.log('🆕 为新用户创建初始配置文件, userId:', userId);
    const supabase = getSupabaseClient();
    
    // 获取当前认证用户信息
    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;
    
    if (!user) {
      console.error('❌ 无法获取用户信息，无法创建profile');
      return;
    }

    const initialProfile = {
      id: userId,
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(initialProfile)
      .select()
      .single();

    if (error) {
      console.error('❌ 创建初始配置文件失败:', error);
      return;
    }

    if (data) {
      console.log('✅ 初始配置文件创建成功:', data);
      userProfile.set(data);
    }
  } catch (error) {
    console.error('💥 创建初始配置文件异常:', error);
  }
}

/**
 * 用户注册
 */
export async function signUp(email: string, password: string, fullName?: string) {
  authState.update(state => ({ ...state, loading: true, error: null }));

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      authState.update(state => ({
        ...state,
        error: error.message,
        loading: false
      }));
      return { success: false, error: error.message };
    }

    authState.update(state => ({
      ...state,
      loading: false
    }));

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '注册失败';
    authState.update(state => ({
      ...state,
      error: errorMessage,
      loading: false
    }));
    return { success: false, error: errorMessage };
  }
}

/**
 * 用户登录
 */
export async function signIn(email: string, password: string) {
  authState.update(state => ({ ...state, loading: true, error: null }));

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      authState.update(state => ({
        ...state,
        error: error.message,
        loading: false
      }));
      return { success: false, error: error.message };
    }

    authState.update(state => ({
      ...state,
      loading: false
    }));

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '登录失败';
    authState.update(state => ({
      ...state,
      error: errorMessage,
      loading: false
    }));
    return { success: false, error: errorMessage };
  }
}

/**
 * 用户登出
 */
export async function signOut() {
  authState.update(state => ({ ...state, loading: true, error: null }));

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      authState.update(state => ({
        ...state,
        error: error.message,
        loading: false
      }));
      return { success: false, error: error.message };
    }

    authState.update(state => ({
      ...state,
      user: null,
      session: null,
      loading: false,
      error: null
    }));

    userProfile.set(null);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '登出失败';
    authState.update(state => ({
      ...state,
      error: errorMessage,
      loading: false
    }));
    return { success: false, error: errorMessage };
  }
}

/**
 * 重置密码
 */
export async function resetPassword(email: string) {
  authState.update(state => ({ ...state, loading: true, error: null }));

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      authState.update(state => ({
        ...state,
        error: error.message,
        loading: false
      }));
      return { success: false, error: error.message };
    }

    authState.update(state => ({
      ...state,
      loading: false
    }));

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '密码重置失败';
    authState.update(state => ({
      ...state,
      error: errorMessage,
      loading: false
    }));
    return { success: false, error: errorMessage };
  }
}

/**
 * 更新用户配置文件
 */
export async function updateProfile(updates: Partial<UserProfile>) {
  try {
    console.log('🔄 开始更新用户配置文件:', updates);
    const supabase = getSupabaseClient();
    
    // 获取当前用户ID
    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;
    
    if (!user) {
      console.error('❌ 用户未登录，无法更新配置文件');
      return { success: false, error: '用户未登录' };
    }

    // 确保更新数据包含用户ID和时间戳
    const updateData = {
      ...updates,
      id: user.id,
      updated_at: new Date().toISOString()
    };

    console.log('📤 发送更新数据:', updateData);

    const { data, error } = await supabase
      .from('profiles')
      .upsert(updateData)
      .select()
      .single();

    console.log('📋 更新结果:', { data, error });

    if (error) {
      console.error('❌ 更新用户配置文件错误:', error);
      return { success: false, error: error.message };
    }

    if (data) {
      console.log('✅ 用户配置文件更新成功:', data);
      userProfile.set(data);
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '更新配置文件失败';
    console.error('💥 更新用户配置文件异常:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * 手动刷新用户配置文件
 */
export async function refreshUserProfile() {
  try {
    console.log('🔄 手动刷新用户配置文件');
    const supabase = getSupabaseClient();
    
    // 获取当前用户
    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;
    
    if (!user) {
      console.log('❌ 用户未登录，无法刷新配置文件');
      return;
    }

    await loadUserProfile(user.id);
  } catch (error) {
    console.error('💥 刷新用户配置文件失败:', error);
  }
}

/**
 * 清除认证错误
 */
export function clearAuthError() {
  authState.update(state => ({ ...state, error: null }));
} 