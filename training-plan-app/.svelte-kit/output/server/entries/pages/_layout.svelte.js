import { c as create_ssr_component } from "../../chunks/ssr.js";
const app = "";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "html{scroll-behavior:smooth}body{margin:0;padding:0}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `   <main class="min-h-screen">${slots.default ? slots.default({}) : ``}</main> `;
});
export {
  Layout as default
};
