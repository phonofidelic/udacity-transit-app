angular.module("transitApp").controller("MapController",["$scope","$log","LocationService","GTFSParserService",function(t,o,e,n){var r=this,a=L.map("map",{scrollWheelZoom:!1}),l=new e,s=new n;r.stops={},r.init=function(){var t=Tangram.leafletLayer({scene:"https://raw.githubusercontent.com/tangrams/refill-style-more-labels/gh-pages/refill-style-more-labels.yaml",attribution:'<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | <a href="http://www.openstreetmap.org/about" target="_blank">&copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'});t.addTo(a),l.getCurrentPosition().then(function(t){a.setView([t.coords.latitude,t.coords.longitude],14)})["catch"](function(t){console.log("getPosition error: ",t)});var e=(L.control.geocoder("search-3LVgAzp").addTo(a),L.control.locate({position:"topleft",keepCurrentZoomLevel:!0}).addTo(a));return e.start(),o.log("init map"),a},setStopMArkers=function(){var t="http://localhost:3000/assets/transitData/stops.txt";s.requestData(t).then(function(t){console.log("GTFSParserService response: ",t);for(var o=[],e=[],n=1;n<t.length-1;n++){var r={},e=L.latLng(t[n][4],t[n][5]);r.lat=t[n][4],r.lon=t[n][5],o.push(e)}return console.log("stop coords: ",o),o}).then(function(t){t.forEach(function(t){L.marker([t.lat,t.lng]).addTo(a)});var o=L.polyline(t,{color:"red"}).addTo(a);a.fitBounds(o.getBounds())})["catch"](function(t){console.log("marker error: ",t)})},r.setRoute=function(t){l.getCurrentPosition().then(function(t){return console.log("getPosition result: ",t),t.coords}).then(function(t){return L.Routing.control({waypoints:[L.latLng(t.latitude,t.longitude),L.latLng(33.8128,-117.9259)],router:L.Routing.mapzen("valhalla-m9bds2x",{costing:"auto"}),formatter:new L.Routing.mapzenFormatter,summaryTemplate:'<div class="start">{name}</div><div class="info {costing}">{distance}, {time}</div>',routeWhileDragging:!1}).addTo(a)})["catch"](function(t){console.log("getPosition error: ",t)})}}]);