import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.C8YNYUmw.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BTdtOKhu.js","_app/immutable/chunks/CDvu5KIv.js","_app/immutable/chunks/pr_9b7ab.js","_app/immutable/chunks/BMDv3NVz.js","_app/immutable/chunks/BrlEh5uC.js","_app/immutable/chunks/B-boyjAy.js","_app/immutable/chunks/D5Umrk68.js","_app/immutable/chunks/7hiSo8OZ.js","_app/immutable/chunks/x2EdFAPA.js","_app/immutable/chunks/Dp1pzeXC.js"];
export const stylesheets = ["_app/immutable/assets/0.DV1GmCyG.css"];
export const fonts = [];
