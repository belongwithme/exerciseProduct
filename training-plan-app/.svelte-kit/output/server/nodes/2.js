

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.a8eceb9f.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.6a6d9526.js"];
export const stylesheets = ["_app/immutable/assets/2.14b024cf.css"];
export const fonts = [];
