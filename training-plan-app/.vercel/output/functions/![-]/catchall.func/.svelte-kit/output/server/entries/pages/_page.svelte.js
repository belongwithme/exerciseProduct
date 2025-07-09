import { N as head, G as store_get, M as escape_html, O as ensure_array_like, P as attr, I as attr_class, Q as stringify, K as unsubscribe_stores, E as pop, A as push } from "../../chunks/index.js";
import "../../chunks/client.js";
import { u as user } from "../../chunks/auth.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const features = [
    {
      title: "训练计划",
      description: "创建和管理个性化训练计划",
      icon: "📋",
      href: "/plans",
      color: "blue"
    },
    {
      title: "能力分析",
      description: "分析弹跳能力和力量结构",
      icon: "📊",
      href: "/analysis",
      color: "green"
    },
    {
      title: "进度追踪",
      description: "追踪训练进度和成果",
      icon: "📈",
      href: "/progress",
      color: "purple"
    },
    {
      title: "训练记录",
      description: "记录每日训练数据",
      icon: "✍️",
      href: "/log",
      color: "orange"
    },
    {
      title: "工具箱",
      description: "实用训练辅助工具",
      icon: "🛠️",
      href: "/tools",
      color: "indigo"
    },
    {
      title: "个人资料",
      description: "管理个人信息和目标",
      icon: "👤",
      href: "/profile",
      color: "pink"
    },
    {
      title: "训练日历",
      description: "查看打卡记录和训练习惯",
      icon: "📅",
      href: "/calendar",
      color: "teal"
    }
  ];
  let stats = { plans: 0, workouts: 0, streak: 0 };
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>训练计划管理系统</title>`;
    $$payload2.out += `<meta name="description" content="专业的训练计划管理应用，支持弹跳训练、力量分析、进度追踪"/>`;
  });
  $$payload.out += `<div class="min-h-screen bg-gray-50 dark:bg-gray-900"><nav class="bg-white dark:bg-gray-800 shadow-sm"><div class="container mx-auto px-4 svelte-bb7tsf"><div class="flex justify-between items-center h-16"><div class="flex items-center"><h1 class="text-xl font-bold text-gray-800 dark:text-white">🏋️‍♂️ 训练计划管理系统</h1></div> <div class="flex items-center space-x-4">`;
  if (store_get($$store_subs ??= {}, "$user", user)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="text-sm text-gray-600 dark:text-gray-400">${escape_html(store_get($$store_subs ??= {}, "$user", user).email)}</span> <button class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">登出</button>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button class="btn-primary text-sm">登录</button> <button class="btn-secondary text-sm">注册</button>`;
  }
  $$payload.out += `<!--]--></div></div></div></nav> <main class="container mx-auto px-4 py-8 svelte-bb7tsf">`;
  if (store_get($$store_subs ??= {}, "$user", user)) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(features);
    $$payload.out += `<div class="mb-8"><h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">欢迎回来！</h2> <p class="text-gray-600 dark:text-gray-400">继续你的训练之旅，每一天都是进步的机会。</p></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600 dark:text-gray-400">训练计划</p> <p class="text-2xl font-bold text-gray-800 dark:text-white">${escape_html(stats.plans)}</p></div> <span class="text-3xl">📋</span></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600 dark:text-gray-400">完成训练</p> <p class="text-2xl font-bold text-gray-800 dark:text-white">${escape_html(stats.workouts)}</p></div> <span class="text-3xl">💪</span></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600 dark:text-gray-400">连续天数</p> <p class="text-2xl font-bold text-gray-800 dark:text-white">${escape_html(stats.streak)}</p></div> <span class="text-3xl">🔥</span></div></div></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let feature = each_array[$$index];
      $$payload.out += `<a${attr("href", feature.href)} class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"><div class="flex items-start"><span class="text-4xl mr-4">${escape_html(feature.icon)}</span> <div class="flex-1"><h3${attr_class(`text-lg font-semibold text-gray-800 dark:text-white group-hover:text-${stringify(feature.color)}-600 dark:group-hover:text-${stringify(feature.color)}-400`, "svelte-bb7tsf")}>${escape_html(feature.title)}</h3> <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${escape_html(feature.description)}</p></div></div></a>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="max-w-2xl mx-auto text-center py-16"><h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">🏋️‍♂️ 训练计划管理系统</h2> <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">专业的弹跳训练与力量分析平台</p> <div class="space-y-4 mb-8"><p class="text-gray-600 dark:text-gray-400">✅ 个性化训练计划定制</p> <p class="text-gray-600 dark:text-gray-400">✅ 科学的能力分析系统</p> <p class="text-gray-600 dark:text-gray-400">✅ 详细的进度追踪记录</p> <p class="text-gray-600 dark:text-gray-400">✅ 实用的训练辅助工具</p></div> <div class="flex justify-center space-x-4"><button class="btn-primary">立即开始</button> <button class="btn-secondary">登录账号</button></div></div>`;
  }
  $$payload.out += `<!--]--></main></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
