export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.Dmmdtf3u.js",app:"_app/immutable/entry/app.CdjYbMEn.js",imports:["_app/immutable/entry/start.Dmmdtf3u.js","_app/immutable/chunks/D5Umrk68.js","_app/immutable/chunks/CDvu5KIv.js","_app/immutable/entry/app.CdjYbMEn.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/CDvu5KIv.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/pr_9b7ab.js","_app/immutable/chunks/CPD9YRgb.js","_app/immutable/chunks/OoKWSaMl.js","_app/immutable/chunks/C6rgrwdz.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js')),
			__memo(() => import('../output/server/nodes/8.js')),
			__memo(() => import('../output/server/nodes/9.js')),
			__memo(() => import('../output/server/nodes/10.js')),
			__memo(() => import('../output/server/nodes/11.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/analysis",
				pattern: /^\/analysis\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/calendar-summary",
				pattern: /^\/api\/calendar-summary\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/calendar-summary/_server.ts.js'))
			},
			{
				id: "/api/exercises",
				pattern: /^\/api\/exercises\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/exercises/_server.ts.js'))
			},
			{
				id: "/api/last-workout",
				pattern: /^\/api\/last-workout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/last-workout/_server.ts.js'))
			},
			{
				id: "/api/plans",
				pattern: /^\/api\/plans\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/plans/_server.ts.js'))
			},
			{
				id: "/api/plans/[id]",
				pattern: /^\/api\/plans\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/plans/_id_/_server.ts.js'))
			},
			{
				id: "/api/plans/[plan_id]/versions",
				pattern: /^\/api\/plans\/([^/]+?)\/versions\/?$/,
				params: [{"name":"plan_id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/plans/_plan_id_/versions/_server.ts.js'))
			},
			{
				id: "/api/plans/[plan_id]/versions/[version_number]",
				pattern: /^\/api\/plans\/([^/]+?)\/versions\/([^/]+?)\/?$/,
				params: [{"name":"plan_id","optional":false,"rest":false,"chained":false},{"name":"version_number","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/plans/_plan_id_/versions/_version_number_/_server.ts.js'))
			},
			{
				id: "/api/setup-demo",
				pattern: /^\/api\/setup-demo\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/setup-demo/_server.ts.js'))
			},
			{
				id: "/api/streak-days",
				pattern: /^\/api\/streak-days\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/streak-days/_server.ts.js'))
			},
			{
				id: "/auth",
				pattern: /^\/auth\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/calendar",
				pattern: /^\/calendar\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/exercises",
				pattern: /^\/exercises\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/log",
				pattern: /^\/log\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/plans",
				pattern: /^\/plans\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/tools",
				pattern: /^\/tools\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/tools/share",
				pattern: /^\/tools\/share\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
