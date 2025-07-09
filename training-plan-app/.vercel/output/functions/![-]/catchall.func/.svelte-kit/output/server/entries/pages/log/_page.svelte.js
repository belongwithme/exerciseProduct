import { N as head, E as pop, A as push } from "../../../chunks/index.js";
import "../../../chunks/auth.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let workoutLogs = [];
  let sortBy = "date";
  let filterBy = "all";
  workoutLogs.filter((log) => filterBy === "all").sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case "date":
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
        break;
      case "duration":
        aVal = a.duration;
        bVal = b.duration;
        break;
      case "exercises":
        aVal = a.exercises.length;
        bVal = b.exercises.length;
        break;
      default:
        return 0;
    }
    return bVal - aVal;
  });
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>训练日志 - 弹跳训练营</title>`;
  });
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">训练日志</h1> <p class="text-gray-600 dark:text-gray-300">记录和追踪你的训练进度</p></div> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <span class="ml-3 text-gray-600 dark:text-gray-300">加载训练记录中...</span></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
