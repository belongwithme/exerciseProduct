import { G as store_get, N as head, M as escape_html, P as attr, O as ensure_array_like, K as unsubscribe_stores, E as pop, A as push } from "../../../chunks/index.js";
import { g as goto } from "../../../chunks/client.js";
import { u as user, b as authError, c as authLoading } from "../../../chunks/auth.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let email = "";
  let password = "";
  let validationErrors = [];
  let isSubmitting = false;
  if (store_get($$store_subs ??= {}, "$user", user)) {
    goto();
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html("登录")} - 训练计划管理系统</title>`;
    $$payload2.out += `<meta name="description" content="登录或注册训练计划管理系统"/>`;
  });
  $$payload.out += `<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"><div class="sm:mx-auto sm:w-full sm:max-w-md"><div class="text-center"><h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">🏋️‍♂️</h1> <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">训练计划管理系统</h2> <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">${escape_html("登录到您的账户")}</p></div></div> <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md"><div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10"><form class="space-y-6">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div><label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">邮箱地址</label> <div class="mt-1"><input id="email" name="email" type="email" autocomplete="email"${attr("value", email)} class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm" placeholder="请输入邮箱地址"/></div></div> <div><label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">密码</label> <div class="mt-1"><input id="password" name="password" type="password"${attr("autocomplete", "current-password")}${attr("value", password)} class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm" placeholder="请输入密码"/></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (validationErrors.length > 0 || store_get($$store_subs ??= {}, "$authError", authError)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="rounded-md bg-red-50 dark:bg-red-900/20 p-4"><div class="flex"><div class="ml-3"><h3 class="text-sm font-medium text-red-800 dark:text-red-200">${escape_html(validationErrors.length > 0 ? "表单验证错误" : "认证错误")}</h3> <div class="mt-2 text-sm text-red-700 dark:text-red-300">`;
    if (validationErrors.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(validationErrors);
      $$payload.out += `<ul class="list-disc list-inside space-y-1"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let error = each_array[$$index];
        $$payload.out += `<li>${escape_html(error)}</li>`;
      }
      $$payload.out += `<!--]--></ul>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (store_get($$store_subs ??= {}, "$authError", authError)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p>${escape_html(store_get($$store_subs ??= {}, "$authError", authError))}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div><button type="submit"${attr("disabled", store_get($$store_subs ??= {}, "$authLoading", authLoading) || isSubmitting, true)} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600">`;
  if (store_get($$store_subs ??= {}, "$authLoading", authLoading) || isSubmitting) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>${escape_html("登录中...")}`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `${escape_html("登录")}`;
  }
  $$payload.out += `<!--]--></button></div> <div class="text-center"><button type="button" class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">${escape_html("还没有账户？点击注册")}</button></div></form> <div class="mt-6 text-center"><a href="/" class="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300">← 返回首页</a></div></div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
