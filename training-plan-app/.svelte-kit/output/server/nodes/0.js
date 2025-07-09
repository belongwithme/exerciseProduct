import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.okjDZ4dm.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DvY-oIkD.js","_app/immutable/chunks/OdQOizuy.js","_app/immutable/chunks/C8SgvbjV.js","_app/immutable/chunks/AOTWZyJM.js","_app/immutable/chunks/BZ6qwgwY.js","_app/immutable/chunks/BPj1ZWv9.js","_app/immutable/chunks/BRzFZVPj.js","_app/immutable/chunks/CEWoIMHy.js","_app/immutable/chunks/x2EdFAPA.js","_app/immutable/chunks/Dp1pzeXC.js"];
export const stylesheets = ["_app/immutable/assets/0.CNxxszU4.css"];
export const fonts = [];
