import { F as getContext, G as store_get, I as attr_class, J as slot, K as unsubscribe_stores, E as pop, A as push } from "../../chunks/index.js";
import "../../chunks/client.js";
import { u as user } from "../../chunks/auth.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<header class="bg-white dark:bg-gray-800 shadow-md"><nav class="container mx-auto px-4 py-2 flex justify-between items-center"><a href="/" class="text-xl font-bold text-blue-600 dark:text-blue-400">弹跳训练营</a> `;
  if (store_get($$store_subs ??= {}, "$user", user)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<ul class="flex items-center space-x-4"><li><a href="/analysis"${attr_class("px-3 py-2 rounded", void 0, {
      "font-bold": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/analysis",
      "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/analysis",
      "text-gray-600": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/analysis",
      "dark:text-white": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/analysis"
    })}>能力分析</a></li> <li><a href="/plans"${attr_class("px-3 py-2 rounded", void 0, {
      "font-bold": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/plans",
      "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/plans",
      "text-gray-600": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/plans",
      "dark:text-white": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/plans"
    })}>训练计划</a></li> <li><a href="/exercises"${attr_class("px-3 py-2 rounded", void 0, {
      "font-bold": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/exercises",
      "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/exercises",
      "text-gray-600": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/exercises",
      "dark:text-white": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/exercises"
    })}>动作库</a></li> <li><a href="/log"${attr_class("px-3 py-2 rounded", void 0, {
      "font-bold": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/log",
      "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/log",
      "text-gray-600": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/log",
      "dark:text-white": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/log"
    })}>训练日志</a></li> <li><a href="/calendar"${attr_class("px-3 py-2 rounded", void 0, {
      "font-bold": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/calendar",
      "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/calendar",
      "text-gray-600": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/calendar",
      "dark:text-white": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/calendar"
    })}>训练日历</a></li> <li><a href="/tools"${attr_class("px-3 py-2 rounded", void 0, {
      "font-bold": store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/tools"),
      "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/tools"),
      "text-gray-600": !store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/tools"),
      "dark:text-white": !store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/tools")
    })}>工具箱</a></li> <li><a href="/profile"${attr_class("px-3 py-2 rounded", void 0, {
      "font-bold": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/profile",
      "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/profile",
      "text-gray-600": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/profile",
      "dark:text-white": store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/profile"
    })}>个人资料</a></li> <li><a href="/setup-demo" class="px-3 py-2 rounded text-sm bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-700">设置演示数据</a></li></ul>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></nav></header> <main class="min-h-screen bg-gray-50 dark:bg-gray-900"><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></main>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
