'use-strict';
angular.module('transitApp')
.controller('PlanTripController', [
	'$scope', 
	'$http', 
	'$timeout', 
	'RequestService', 
	'LocationService', 
	'TransitLandRequestService', 
	'TransitDataService',
	function($scope, $http, $timeout, RequestService, LocationService, TransitLandRequestService, TransitDataService) {

	var vm = this;
	var requestService = new RequestService();
	var locationService = new LocationService();
	var transitService = new TransitLandRequestService();
	var transitDataService = new TransitDataService();

	vm.inputData = {};
	vm.inputData.departure = {};
	vm.inputData.departure.coords = {};
	vm.inputData.arrival = {};
	vm.inputData.arrival.coords = {};
	vm.currentPosition = {};

	// vm.transitDataService = new TransitDataService();

	// vm.tripData = {};

	vm.stopsRequest = function() {
		transitDataService.requestData().then(function(response) {
			console.log('transitDataService response: ', response);
			vm.stopsData = response;			
		});
	};

	vm.transitRequest = function(region) {
		transitService.routesByOperator(region).then(function(response) {
			vm.routeData = response.data.routes;
			console.log('transitRequest response: ', response);
		});
	};

	vm.getStopInifo = function() {
		console.log('getStopInifo: ');
		vm.routeData[0].stops_served_by_route.forEach(function() {
			transitService.getStopInfo(this.onestop_id);
		});
		
	}

	vm.routeBetween = function(dep_onestop_id, arr_onestop_id) {
		transitService.routeBetween(dep_onestop_id, arr_onestop_id).then(function(response) {
			console.log('controller routeBetween response: ', response);
		});
	};

	vm.routeRequest = function(onestop_id) {
		transitService.routeByOnestopId(onestop_id).then(function(response) {
			vm.routeData = response.data.routes;
			console.log('routeRequest response: ', response);
		});
	};

	vm.getCurrentPosition = function() {
		var position = locationService.getCurrentPosition().then(function(position) {
			console.log('getPosition result: ', position.coords);
			vm.currentPosition.lat = position.coords.latitude;
			vm.currentPosition.lon = position.coords.longitude;
			return position.coords;
		}).then(function(position) {
			locationService.revGeocode(position).then(function(results) {
				console.log('region: ', results.address_components[3].short_name);
				vm.currentPosition.addressString = results.formatted_address;
				// vm.currentPosition.countyString = results.address_components[3].short_name;
				vm.currentPosition.countyString = 'o-dhw-browardcountytransit';
			});
		});

		
	};

	vm.autoAddress = function(id) {
		var input = document.getElementById(id);
		var options = {
			types: ['address']
		};
		if (input.id === 'departure-inp') {
			$scope.departureAutocomplete = new google.maps.places.Autocomplete(input, options);
		} else {
			$scope.arrivalAutocomplete = new google.maps.places.Autocomplete(input, options);
		}
	};

	vm.getAddress = function(id) {
		if (id === 'departure-inp') {
			$timeout(function() {
				console.log('*** getAddress ***');
				console.log('locationData: ', $scope.departureAutocomplete.getPlace());
				if ($scope.departureAutocomplete.getPlace()) {
					vm.inputData.departure.name = $scope.departureAutocomplete.getPlace().formatted_address;
					vm.inputData.departure.coords.lat = $scope.departureAutocomplete.getPlace().geometry.location.lat();
					vm.inputData.departure.coords.lon = $scope.departureAutocomplete.getPlace().geometry.location.lng();
				}
			}, 500);
		} else {
			$timeout(function() {
				console.log('*** getAddress ***');
				console.log('locationData: ', $scope.arrivalAutocomplete.getPlace());
				if ($scope.arrivalAutocomplete.getPlace()) {
					vm.inputData.arrival.name = $scope.arrivalAutocomplete.getPlace().formatted_address;
					vm.inputData.arrival.coords.lat = $scope.arrivalAutocomplete.getPlace().geometry.location.lat();
					vm.inputData.arrival.coords.lon = $scope.arrivalAutocomplete.getPlace().geometry.location.lng();
				}
			}, 500);
		}
	};



	vm.sendRequest = function(input) {
		var requestParams = {
			"locations": [
				{
					"lat": vm.inputData.departure.coords.lat || vm.currentPosition.lat,
					"lon": vm.inputData.departure.coords.lon || vm.currentPosition.lon
					// "type": "break"
				},
				{
					"lat": vm.inputData.arrival.coords.lat,
					"lon": vm.inputData.arrival.coords.lon
					// "type": "break"
				}	
			],
			"costing": "multimodal",
			"costing_options": {
				"transit": {
					"use_bus": 0.1,
					"use_rail": 1.0
				}
			},
			"directions_options": { "units":"miles" }
		}
		var url = 'https://valhalla.mapzen.com/route?json='+JSON.stringify(requestParams)+'&api_key=valhalla-m9bds2x'.replace('%22', '');

		$http({
			method: 'GET',
			url: url,
		}).then(function(response) {
			console.log('sendRequest response: ', response);
			vm.tripData = response.data.trip;
		}).catch(function(e) {
			console.log('RequestService.send error: ', e);
		});
	};
}]);