import { d as derived, w as writable } from "./index3.js";
import { s as supabase } from "./supabaseClient.js";
const initialState = {
  user: null,
  session: null,
  loading: true,
  error: null
};
const authState = writable(initialState);
const user = derived(authState, ($authState) => $authState.user);
derived(authState, ($authState) => $authState.session);
const authLoading = derived(authState, ($authState) => $authState.loading);
const authError = derived(authState, ($authState) => $authState.error);
const userProfile = writable(null);
async function initAuth() {
  try {
    const { data: { session: session2 }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("获取会话错误:", error);
      authState.update((state) => ({
        ...state,
        error: error.message,
        loading: false
      }));
      return;
    }
    authState.update((state) => ({
      ...state,
      user: session2?.user || null,
      session: session2,
      loading: false,
      error: null
    }));
    if (session2?.user) {
      await loadUserProfile(session2.user.id);
    }
    supabase.auth.onAuthStateChange(async (event, session3) => {
      console.log("认证状态变化:", event, session3?.user?.email);
      authState.update((state) => ({
        ...state,
        user: session3?.user || null,
        session: session3,
        loading: false,
        error: null
      }));
      if (event === "SIGNED_IN" && session3?.user) {
        await loadUserProfile(session3.user.id);
      } else if (event === "SIGNED_OUT") {
        userProfile.set(null);
      }
    });
  } catch (error) {
    console.error("初始化认证错误:", error);
    authState.update((state) => ({
      ...state,
      error: "认证初始化失败",
      loading: false
    }));
  }
}
async function loadUserProfile(userId) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error && error.code !== "PGRST116") {
      console.error("加载用户配置文件错误:", error);
      return;
    }
    if (data) {
      userProfile.set(data);
    }
  } catch (error) {
    console.error("加载用户配置文件异常:", error);
  }
}
if (typeof window !== "undefined") {
  initAuth();
}
export {
  userProfile as a,
  authError as b,
  authLoading as c,
  user as u
};
