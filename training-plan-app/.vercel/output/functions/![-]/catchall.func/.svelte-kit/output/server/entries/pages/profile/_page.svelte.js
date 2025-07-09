import { G as store_get, N as head, M as escape_html, K as unsubscribe_stores, E as pop, A as push } from "../../../chunks/index.js";
import { u as user, a as userProfile } from "../../../chunks/auth.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let profile = {
    full_name: "",
    email: "",
    height_cm: "",
    weight_kg: "",
    birth_date: "",
    gender: "",
    experience_level: "",
    goals: "",
    bio: "",
    // 弹跳相关数据
    standing_reach_cm: "",
    max_touch_height_cm: "",
    target_touch_height_cm: "",
    // 训练重量数据
    bench_press_kg: "",
    squat_kg: "",
    deadlift_kg: ""
  };
  function fillFormFromProfile() {
    try {
      if (store_get($$store_subs ??= {}, "$user", user)) {
        profile.email = store_get($$store_subs ??= {}, "$user", user).email || "";
        profile.full_name = store_get($$store_subs ??= {}, "$user", user).user_metadata?.full_name || "";
      }
      if (store_get($$store_subs ??= {}, "$userProfile", userProfile)) {
        profile = {
          full_name: store_get($$store_subs ??= {}, "$userProfile", userProfile).full_name || "",
          email: store_get($$store_subs ??= {}, "$userProfile", userProfile).email || store_get($$store_subs ??= {}, "$user", user)?.email || "",
          height_cm: store_get($$store_subs ??= {}, "$userProfile", userProfile).height_cm?.toString() || "",
          weight_kg: store_get($$store_subs ??= {}, "$userProfile", userProfile).weight_kg?.toString() || "",
          birth_date: store_get($$store_subs ??= {}, "$userProfile", userProfile).birth_date || "",
          gender: store_get($$store_subs ??= {}, "$userProfile", userProfile).gender || "",
          experience_level: store_get($$store_subs ??= {}, "$userProfile", userProfile).experience_level || "",
          goals: store_get($$store_subs ??= {}, "$userProfile", userProfile).goals || "",
          bio: store_get($$store_subs ??= {}, "$userProfile", userProfile).bio || "",
          // 弹跳相关数据
          standing_reach_cm: store_get($$store_subs ??= {}, "$userProfile", userProfile).standing_reach_cm?.toString() || "",
          max_touch_height_cm: store_get($$store_subs ??= {}, "$userProfile", userProfile).max_touch_height_cm?.toString() || "",
          target_touch_height_cm: store_get($$store_subs ??= {}, "$userProfile", userProfile).target_touch_height_cm?.toString() || "",
          // 训练重量数据
          bench_press_kg: store_get($$store_subs ??= {}, "$userProfile", userProfile).bench_press_kg?.toString() || "",
          squat_kg: store_get($$store_subs ??= {}, "$userProfile", userProfile).squat_kg?.toString() || "",
          deadlift_kg: store_get($$store_subs ??= {}, "$userProfile", userProfile).deadlift_kg?.toString() || ""
        };
      }
    } catch (err) {
      console.error("填充表单数据失败:", err);
    }
  }
  function getExperienceLevelLabel(level) {
    const levels = {
      beginner: "初学者",
      intermediate: "中级",
      advanced: "高级",
      professional: "专业级"
    };
    return levels[level] || level;
  }
  function getGenderLabel(gender) {
    const genders = { male: "男", female: "女", other: "其他" };
    return genders[gender] || gender;
  }
  function calculateAge(birthDate) {
    if (!birthDate) return "";
    const today = /* @__PURE__ */ new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
      age--;
    }
    return age;
  }
  function calculateBMI(height, weight) {
    if (!height || !weight) return "";
    const h = parseInt(height) / 100;
    const w = parseInt(weight);
    const bmi = w / (h * h);
    return bmi.toFixed(1);
  }
  if (store_get($$store_subs ??= {}, "$userProfile", userProfile) && true && true) {
    fillFormFromProfile();
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>个人资料 - 弹跳训练营</title>`;
  });
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">个人资料</h1> <p class="text-gray-600 dark:text-gray-300">管理您的个人信息和训练偏好</p></div> `;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="max-w-4xl mx-auto"><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6"><div class="flex items-center space-x-6"><div class="flex-shrink-0"><div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">${escape_html(profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "U")}</div></div> <div class="flex-1"><h2 class="text-2xl font-bold text-gray-900 dark:text-white">${escape_html(profile.full_name || "未设置姓名")}</h2> <p class="text-gray-600 dark:text-gray-300">${escape_html(profile.email)}</p> <div class="mt-2 flex flex-wrap gap-2">`;
    if (profile.experience_level) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">${escape_html(getExperienceLevelLabel(profile.experience_level))}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (profile.gender) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">${escape_html(getGenderLabel(profile.gender))}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (profile.birth_date) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">${escape_html(calculateAge(profile.birth_date))}岁</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div> <div class="flex-shrink-0 space-x-3">`;
    {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> 编辑资料</button>`;
    }
    $$payload.out += `<!--]--> <button class="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> 退出登录</button></div></div></div> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6"><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本信息</h3> <div class="space-y-4"><div><label for="full_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.full_name || "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label> <p class="text-gray-900 dark:text-white">${escape_html(profile.email)}</p> <p class="text-xs text-gray-500 dark:text-gray-400">邮箱地址无法修改</p></div> <div><label for="birth_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">出生日期</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.birth_date ? new Date(profile.birth_date).toLocaleDateString("zh-CN") : "未设置")} `;
      if (profile.birth_date) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="text-gray-500 dark:text-gray-400">(${escape_html(calculateAge(profile.birth_date))}岁)</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="gender" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">性别</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(getGenderLabel(profile.gender) || "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">体格信息</h3> <div class="space-y-4"><div><label for="height_cm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">身高 (cm)</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.height_cm ? profile.height_cm + " cm" : "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="weight_kg" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">体重 (kg)</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.weight_kg ? profile.weight_kg + " kg" : "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> `;
    if (profile.height_cm && profile.weight_kg) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BMI</label> <p class="text-gray-900 dark:text-white">${escape_html(calculateBMI(profile.height_cm, profile.weight_kg))}</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div><label for="experience_level" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">训练水平</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(getExperienceLevelLabel(profile.experience_level) || "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">弹跳能力数据</h3> <div class="space-y-4"><div><label for="standing_reach_cm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">站立摸高 (cm)</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.standing_reach_cm ? profile.standing_reach_cm + " cm" : "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="max_touch_height_cm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">最大摸高 (cm)</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.max_touch_height_cm ? profile.max_touch_height_cm + " cm" : "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="target_touch_height_cm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">目标摸高 (cm)</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.target_touch_height_cm ? profile.target_touch_height_cm + " cm" : "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> `;
    if (profile.standing_reach_cm && profile.max_touch_height_cm) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">垂直跳跃</label> <p class="text-gray-900 dark:text-white">${escape_html(parseInt(profile.max_touch_height_cm) - parseInt(profile.standing_reach_cm))} cm</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (profile.max_touch_height_cm && profile.target_touch_height_cm) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">需提升高度</label> <p class="text-gray-900 dark:text-white">${escape_html(parseInt(profile.target_touch_height_cm) - parseInt(profile.max_touch_height_cm))} cm</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">训练重量数据</h3> <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">记录您的三大项训练重量（1RM或最大重量）</p> <div class="space-y-4"><div><label for="bench_press_kg" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">卧推 (kg)</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.bench_press_kg ? profile.bench_press_kg + " kg" : "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="squat_kg" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">深蹲 (kg)</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.squat_kg ? profile.squat_kg + " kg" : "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="deadlift_kg" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">硬拉 (kg)</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.deadlift_kg ? profile.deadlift_kg + " kg" : "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> `;
    if (profile.bench_press_kg && profile.squat_kg && profile.deadlift_kg && profile.weight_kg) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"><h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">力量指标</h4> <div class="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400"><div class="text-center"><p class="font-medium">卧推/体重</p> <p>${escape_html((parseFloat(profile.bench_press_kg) / parseFloat(profile.weight_kg)).toFixed(1))}x</p></div> <div class="text-center"><p class="font-medium">深蹲/体重</p> <p>${escape_html((parseFloat(profile.squat_kg) / parseFloat(profile.weight_kg)).toFixed(1))}x</p></div> <div class="text-center"><p class="font-medium">硬拉/体重</p> <p>${escape_html((parseFloat(profile.deadlift_kg) / parseFloat(profile.weight_kg)).toFixed(1))}x</p></div></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">训练目标</h3> <div class="space-y-4"><div><label for="goals" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">训练目标</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.goals || "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">个人简介</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(profile.bio || "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div></div></div></div> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
