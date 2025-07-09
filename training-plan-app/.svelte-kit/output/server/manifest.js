export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.fa5ad7f3.js","app":"_app/immutable/entry/app.5e838097.js","imports":["_app/immutable/entry/start.fa5ad7f3.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/singletons.d93fd101.js","_app/immutable/entry/app.5e838097.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.6a6d9526.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
