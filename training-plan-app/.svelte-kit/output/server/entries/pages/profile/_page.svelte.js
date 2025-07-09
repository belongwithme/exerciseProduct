import { N as head, M as escape_html, E as pop, A as push } from "../../../chunks/index.js";
import "../../../chunks/auth.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let profile = {
    email: "",
    gender: "",
    experience_level: ""
  };
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
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>个人资料 - 弹跳训练营</title>`;
  });
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">个人资料</h1> <p class="text-gray-600 dark:text-gray-300">管理您的个人信息和训练偏好</p></div> `;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="max-w-4xl mx-auto"><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6"><div class="flex items-center space-x-6"><div class="flex-shrink-0"><div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">${escape_html("U")}</div></div> <div class="flex-1"><h2 class="text-2xl font-bold text-gray-900 dark:text-white">${escape_html("未设置姓名")}</h2> <p class="text-gray-600 dark:text-gray-300">${escape_html(profile.email)}</p> <div class="mt-2 flex flex-wrap gap-2">`;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    {
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
    $$payload.out += `<!--]--> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本信息</h3> <div class="space-y-4"><div><label for="full_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html("未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label> <p class="text-gray-900 dark:text-white">${escape_html(profile.email)}</p> <p class="text-xs text-gray-500 dark:text-gray-400">邮箱地址无法修改</p></div> <div><label for="birth_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">出生日期</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html("未设置")} `;
      {
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
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html("未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="weight_kg" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">体重 (kg)</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html("未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div><label for="experience_level" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">训练水平</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html(getExperienceLevelLabel(profile.experience_level) || "未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">训练目标</h3> <div class="space-y-4"><div><label for="goals" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">训练目标</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html("未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div> <div><label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">个人简介</label> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-900 dark:text-white">${escape_html("未设置")}</p>`;
    }
    $$payload.out += `<!--]--></div></div></div></div> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
