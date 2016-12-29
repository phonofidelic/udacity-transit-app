angular.module("transitApp").factory("TransitLandRequestService",["$http",function(t){function o(){}return o.prototype.routesByOperator=function(o){var n={region:o},e="https://transit.land/api/v1/routes?operated_by="+n.region;return t({method:"GET",url:e,eventHandlers:{progress:function(t){console.log("progress: ",t)}}}).then(function(t){return t})["catch"](function(t){console.log("transitland error: ",t)})},o.prototype.routeByOnestopId=function(o){var n="https://transit.land/api/v1/routes?onestop_id="+o;return t({method:"GET",url:n,eventHandlers:{progress:function(t){console.log("progress: ",t)}}}).then(function(t){return t})["catch"](function(t){console.log("transitland error: ",t)})},o.prototype.routesByBbox=function(o){return new Promise(function(n){var e=o.lat+.05,r=o.lon-.05,s=o.lat-.05,a=o.lon+.05,i="https://transit.land/api/v1/routes?bbox="+r+","+e+","+a+","+s;return t.get(i).then(function(t){console.log("bbox response: ",t),n(t.data)})})},o.prototype.getStaticRoutes=function(){return t.get("assets/mockData/staticRoutesPortland.json").then(function(t){return console.log("mock routes:",t),t.data})},o.prototype.getStopInfo=function(o){var n="http://transit.land/api/v1/stops?onestop_id="+o;return t({method:"GET",url:n}).then(function(t){return console.log("getStopInfo response: ",t),t})["catch"](function(t){console.log("getStopInfo error: ",t)})},o.prototype.routeBetween=function(o,n){return t({method:"GET",url:"http://transit.land/api/v1/stops?onestop_id="+o}).then(function(t){var o={origin:t.data.stops[0]};return o}).then(function(o){return t({method:"GET",url:"http://transit.land/api/v1/stops?onestop_id="+n}).then(function(t){return o.destination=t.data.stops[0],o}).then(function(o){console.log("endpoints: ",o),console.log("endpoints.origin: ",o.origin),console.log("endpoints.destination: ",o.destination);var n={locations:[{lat:o.origin.geometry.coordinates[1],lon:o.origin.geometry.coordinates[0],type:"break"},{lat:o.destination.geometry.coordinates[1],lon:o.destination.geometry.coordinates[0],type:"break"}],costing:"multimodal"},e=(JSON.stringify(n),"https://valhalla.mapzen.com/route?json="+JSON.stringify(n)+"&api_key=valhalla-m9bds2x".replace("%22",""));console.log("mapzenUrl: ",e),t({method:"GET",url:e}).then(function(t){return console.log("routeBetween response: ",t),t})["catch"](function(t){console.log("routeBetween error: ",t)})}),o})},o.prototype.scheduleStopPairs=function(o){return t.get("http://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id="+o).then(function(t){return console.log("schedule_stop_pair response: ",t),t.data.schedule_stop_pairs})["catch"](function(t){console.log("schedule_stop_pair error: ",t)})},o.prototype.routeStopPattern=function(o){return t({method:"GET",url:"http://transit.land/api/v1/route_stop_patterns?onestop_id="+o}).then(function(t){console.log("from routeStopPattern: "),console.log(t);var o=[];return t.data.route_stop_patterns[0].stop_pattern.forEach(function(t){o.push(t)}),o})["catch"](function(t){console.log("routeStopPattern error: ",t)})},o}]);