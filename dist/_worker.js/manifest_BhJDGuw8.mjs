globalThis.process ??= {}; globalThis.process.env ??= {};
import { n as decodeKey } from './chunks/astro/server_CBBsGw1V.mjs';
import './chunks/astro-designed-error-pages_BaqZX0Xt.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_DWGPcmfI.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/zunayedali/Projects/52_weeks/astro-rewrite/","cacheDir":"file:///Users/zunayedali/Projects/52_weeks/astro-rewrite/node_modules/.astro/","outDir":"file:///Users/zunayedali/Projects/52_weeks/astro-rewrite/dist/","srcDir":"file:///Users/zunayedali/Projects/52_weeks/astro-rewrite/src/","publicDir":"file:///Users/zunayedali/Projects/52_weeks/astro-rewrite/public/","buildClientDir":"file:///Users/zunayedali/Projects/52_weeks/astro-rewrite/dist/","buildServerDir":"file:///Users/zunayedali/Projects/52_weeks/astro-rewrite/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"activity/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/activity","isIndex":false,"type":"page","pattern":"^\\/activity\\/?$","segments":[[{"content":"activity","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/activity.astro","pathname":"/activity","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"bookshelf/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/bookshelf","isIndex":false,"type":"page","pattern":"^\\/bookshelf\\/?$","segments":[[{"content":"bookshelf","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/bookshelf.astro","pathname":"/bookshelf","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}}],"site":"https://zunayed.dev","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/zunayedali/Projects/52_weeks/astro-rewrite/src/pages/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/zunayedali/Projects/52_weeks/astro-rewrite/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/zunayedali/Projects/52_weeks/astro-rewrite/src/pages/tags/[tag].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/tags/[tag]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/zunayedali/Projects/52_weeks/astro-rewrite/src/pages/activity.astro",{"propagation":"none","containsHead":true}],["/Users/zunayedali/Projects/52_weeks/astro-rewrite/src/pages/bookshelf.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/activity@_@astro":"pages/activity.astro.mjs","\u0000@astro-page:src/pages/bookshelf@_@astro":"pages/bookshelf.astro.mjs","\u0000@astro-page:src/pages/tags/[tag]@_@astro":"pages/tags/_tag_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/[...slug]@_@astro":"pages/_---slug_.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BhJDGuw8.mjs","/Users/zunayedali/Projects/52_weeks/astro-rewrite/node_modules/astro/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/Users/zunayedali/Projects/52_weeks/astro-rewrite/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_Dan9wda7.mjs","/Users/zunayedali/Projects/52_weeks/astro-rewrite/.astro/content-assets.mjs":"chunks/content-assets_XqCgPAV2.mjs","/Users/zunayedali/Projects/52_weeks/astro-rewrite/.astro/content-modules.mjs":"chunks/content-modules_Bvq7llv8.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_DLZhXeHL.mjs","/Users/zunayedali/Projects/52_weeks/astro-rewrite/src/components/ActivityHeatmap.jsx":"_astro/ActivityHeatmap.DVHOKNrz.js","@astrojs/react/client.js":"_astro/client.BJHgAj4G.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/graph.BjEb-bcZ.png","/_astro/heap.CFL6oyOi.png","/_astro/grid.BDghS7RW.png","/_astro/drawing.Bgrtprd1.png","/favicon.ico","/_astro/ActivityHeatmap.DVHOKNrz.js","/_astro/client.BJHgAj4G.js","/_astro/index._OACqPSs.js","/css/cal-heatmap.css","/css/site_wide.css","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/files/zunayed_ali_latex.pdf","/js/cal-heatmap.min.js","/js/d3.v3.min.js","/js/highlight.min.js","/life_tracker/index.html","/tracker_data/2017_cal_data.json","/_worker.js/_astro/drawing.Bgrtprd1.png","/_worker.js/_astro/graph.BjEb-bcZ.png","/_worker.js/_astro/grid.BDghS7RW.png","/_worker.js/_astro/heap.CFL6oyOi.png","/_worker.js/chunks/Footer_Dibrckp6.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_Bjv4JU__.mjs","/_worker.js/chunks/_astro_assets_CTds4Ovf.mjs","/_worker.js/chunks/_astro_content_Dwi7Rd-W.mjs","/_worker.js/chunks/_astro_data-layer-content_DLZhXeHL.mjs","/_worker.js/chunks/astro-designed-error-pages_BaqZX0Xt.mjs","/_worker.js/chunks/astro_DlZqW84c.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/consts_47CwkweC.mjs","/_worker.js/chunks/content-assets_XqCgPAV2.mjs","/_worker.js/chunks/content-modules_Bvq7llv8.mjs","/_worker.js/chunks/index_7vfuASRV.mjs","/_worker.js/chunks/noop-middleware_DWGPcmfI.mjs","/_worker.js/chunks/parse_DGrrK2jG.mjs","/_worker.js/chunks/path_BgNISshD.mjs","/_worker.js/chunks/remote_CrdlObHx.mjs","/_worker.js/chunks/sharp_Dan9wda7.mjs","/_worker.js/pages/_---slug_.astro.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/pages/activity.astro.mjs","/_worker.js/pages/bookshelf.astro.mjs","/_worker.js/pages/index.astro.mjs","/images/epi/10.1.a.png","/images/epi/10.1.b.png","/images/epi/10.4.a.png","/images/epi/10.4.b.png","/images/epi/10.5.a.png","/images/epi/11_1_a.png","/images/epi/11_3_a.png","/images/epi/11_3_b.png","/images/epi/11_3_c.png","/images/p13/path_compare.png","/images/p13/problem.png","/images/p13/recursion_tree.png","/images/p11/example.png","/images/p11/example2.png","/images/p11/problem.png","/images/p11/subproblem.png","/images/p10/case1.png","/images/p10/case2.png","/images/p10/edgecase.png","/images/p10/max.png","/images/p10/problem.png","/images/p10/subproblem.png","/images/p14/back.png","/images/p14/bfs.png","/images/p14/bfs_target.png","/images/p14/problem.png","/images/p12/left.png","/images/p12/problem.png","/images/p12/right.png","/images/p17/direction.png","/images/p17/example.png","/images/p17/movement.png","/images/p17/partial_graph.png","/images/p17/problem.png","/images/p19/problem.png","/images/p19/recursion_tree.png","/images/p19/table_to_graph.png","/images/p15/dfs_problem.png","/images/p15/problem.png","/images/p15/recursion_tree.png","/images/p20/cycle.png","/images/p20/graph.png","/images/p20/no_cycle.png","/images/p20/path.png","/images/p20/problem.png","/images/p18/bfs_traversal_1.png","/images/p18/bfs_traversal_2.png","/images/p18/bfs_traversal_3.png","/images/p18/bit_mask.png","/images/p18/key_ring.png","/images/p18/ordinal.png","/images/p18/problem.png","/images/p18/problem2.png","/images/p16/first_island.png","/images/p16/problem.png","/images/p16/traverse.png","/images/p16/visited_matrix.png","/images/p21/check_above.png","/images/p21/manual_solve.png","/images/p21/moves.png","/images/p21/problem.png","/images/p22/problem.png","/images/p22/steps.png","/images/p25/partition.png","/images/p25/partition2.png","/images/p25/tree.png","/images/p23/min_dist.png","/images/p23/options.png","/images/p23/problem.png","/images/p23/recursive_path.png","/images/p26/example.png","/images/p26/flag.png","/images/p26/pivot.png","/images/p26/problem.png","/images/p29/divide_conquer.png","/images/p29/merge.png","/images/p29/proof.png","/images/p29/unfinished.png","/images/p28/add1.png","/images/p28/add2.png","/images/p28/array_representation.png","/images/p28/extract.png","/images/p28/max_heap_tree.png","/images/p28/sort1.png","/images/p28/sort2.png","/images/p7/one_node.png","/images/p7/problem.png","/images/p7/three_nodes.png","/images/p7/two_nodes.png","/images/p24/bad_connections.png","/images/p24/final_graph.png","/images/p24/good_connections.png","/images/p24/problem.png","/images/p24/tie_breaker.png","/images/p8/call_stack.png","/images/p8/full_tree.png","/images/p8/partial_tree.png","/images/p9/path_counts.png","/images/p9/problem.png","/images/p9/recursion_tree.png","/images/p9/stay_on_grid.png","/images/p9/time_space.png","/travel-minisites/italy/index.html","/travel-minisites/nepal/index.html","/travel-minisites/nepal/index2.html","/travel-minisites/spain/index.html","/travel-minisites/static/background.png","/_worker.js/chunks/astro/server_CBBsGw1V.mjs","/_worker.js/pages/tags/_tag_.astro.mjs","/travel-minisites/static/img/DSC_3145.jpg","/travel-minisites/static/img/DSC_3149.jpg","/travel-minisites/static/img/DSC_3156.jpg","/travel-minisites/static/img/DSC_3169.jpg","/travel-minisites/static/img/DSC_3243.jpg","/travel-minisites/static/img/DSC_3247.jpg","/travel-minisites/static/img/DSC_3276.jpg","/travel-minisites/static/img/DSC_3305.jpg","/travel-minisites/static/img/DSC_3341.jpg","/travel-minisites/static/img/DSC_3353.jpg","/travel-minisites/static/img/DSC_3370.jpg","/travel-minisites/static/img/DSC_3424.jpg","/travel-minisites/static/img/DSC_3426.jpg","/travel-minisites/static/img/map.png","/travel-minisites/static/img/steps.png","/travel-minisites/static/img/weather.png","/travel-minisites/static/lib/jquery-1.12.2.min.js","/travel-minisites/static/img/spain/flower_sketch.png","/travel-minisites/static/img/spain/map.png","/travel-minisites/static/lib/js/vue@2.3.3","/travel-minisites/static/lib/js/vue_2.3.3.js","/travel-minisites/static/lib/bootstrap/css/bootstrap-theme.css","/travel-minisites/static/lib/bootstrap/css/bootstrap-theme.css.map","/travel-minisites/static/lib/bootstrap/css/bootstrap-theme.min.css","/travel-minisites/static/lib/bootstrap/css/bootstrap-theme.min.css.map","/travel-minisites/static/lib/bootstrap/css/bootstrap.css","/travel-minisites/static/lib/bootstrap/css/bootstrap.css.map","/travel-minisites/static/lib/bootstrap/css/bootstrap.min.css","/travel-minisites/static/lib/bootstrap/css/bootstrap.min.css.map","/travel-minisites/static/lib/bootstrap/fonts/glyphicons-halflings-regular.eot","/travel-minisites/static/lib/bootstrap/fonts/glyphicons-halflings-regular.svg","/travel-minisites/static/lib/bootstrap/fonts/glyphicons-halflings-regular.ttf","/travel-minisites/static/lib/bootstrap/fonts/glyphicons-halflings-regular.woff","/travel-minisites/static/lib/bootstrap/fonts/glyphicons-halflings-regular.woff2","/travel-minisites/static/lib/css/font-awesome.min.css","/travel-minisites/static/lib/bootstrap/js/bootstrap.js","/travel-minisites/static/lib/bootstrap/js/bootstrap.min.js","/travel-minisites/static/lib/bootstrap/js/npm.js","/activity/index.html","/bookshelf/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"dFSYSjK3AxA9gh4HPsCmdFjKtLPT3LyB6V4BatWQ8Bc=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
