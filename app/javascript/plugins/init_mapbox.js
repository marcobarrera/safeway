import mapboxgl, { GeolocateControl } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { data, event, map } from 'jquery';

const buildMap = (mapElement, id = 'map') => {
	mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
	return new mapboxgl.Map({
		container: id,
		style: 'mapbox://styles/mapbox/light-v10',
		center: [ -118.243683, 34.052235 ],
		zoom: 5
	});
};

const addMarkersToMap = (map, markers) => {
	markers.forEach((marker) => {
		const popup = new mapboxgl.Popup().setHTML(marker.infoWindow);

		// Create a HTML element for your custom marker
		const element = document.createElement('div');
		element.className = 'marker';
		element.style.backgroundImage = `url('${marker.image_url}')`;
		element.style.backgroundSize = 'contain';
		element.style.width = '25px';
		element.style.height = '25px';

		// Pass the element as an argument to the new marker
		new mapboxgl.Marker(element).setLngLat([ marker.lng, marker.lat ]).setPopup(popup).addTo(map);
	});
};

const fitMapToMarkers = (map, markers) => {
	const bounds = new mapboxgl.LngLatBounds();
	markers.forEach((marker) => bounds.extend([ marker.lng, marker.lat ]));
	map.fitBounds(bounds, { padding: 70, maxZoom: 15 });
};

const userCoords = {};

const geolocate = (map) => {
	// Initialize the geolocate control.
	var geolocate = new mapboxgl.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true
		},
		trackUserLocation: true
	});

	// Add the control to the map.
	const coordInfo = map.addControl(geolocate);
	map.on('load', function() {
		geolocate.trigger();
	});

	setTimeout(function() {
		userCoords['lng'] = coordInfo.transform._center.lng;
		userCoords['lat'] = coordInfo.transform._center.lat;
	}, 7000);
};

const directionsSearchBar = (map) => {
	var nav = new mapboxgl.NavigationControl();

	var directions = new MapboxDirections({
		accessToken: mapboxgl.accessToken,
		unit: 'metric',
		profile: 'mapbox/cycling',
		alternatives: 'true',
		geometries: 'geojson'
	});

	directions.on('route', () => {
		var list = document.querySelector('.mapbox-directions-steps');

		if (list) {
			let routes = document.querySelectorAll('.mapbox-directions-route');
			let directions = list.querySelectorAll('li');
			let lastDirection = directions[directions.length - 1];
			lastDirection.addEventListener('click', () => {
				var id = document.querySelector('#reviewdestination');
				id.click();
			});
		}
	});

	map.scrollZoom.enable();
	map.addControl(directions, 'top-right');

	obstacleData(map, directions);
};

const obstacleData = (map, directions) => {
	var clearances = {
		type: 'FeatureCollection',
		features: []
	};

	for (let alert of gon.alerts) {
		if (alert.longitude && alert.latitude) {
			clearances.features.push({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [ alert.longitude, alert.latitude ]
				}
			});
		}
	}

	var obstacle = turf.buffer(clearances, 0.05, { units: 'kilometers' });
	routeCollisions(map, directions, obstacle);
};

//1. Send location on click
//2. get the location of a specific person
const routeDisplay = (map) => {
	map.on('load', function(e) {
		//Create sources and layers for the returned routes.
		//There will be a maximum of 3 results from the Directions API.
		//We use a loop to create the sources and layers.
		for (let i = 0; i <= 2; i++) {
			map.addSource('route' + i, {
				type: 'geojson',
				data: {
					type: 'Feature'
				}
			});

			map.addLayer({
				id: 'route' + i,
				type: 'line',
				source: 'route' + i,
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': '#cccccc',
					'line-opacity': 0.5,
					'line-width': 13,
					'line-blur': 0.5
				}
			});
		}
	});
};

const routeCollisions = (map, directions, obstacle) => {
	directions.on('route', (e) => {
		var reports = document.getElementById('reports');
		reports.innerHTML = '';
		var report = reports.appendChild(document.createElement('div'));
		let routes = e.route;

		//Hide all routes by setting the opacity to zero.
		for (let i = 0; i < 3; i++) {
			map.setLayoutProperty('route' + i, 'visibility', 'none');
		}

		routes.forEach(function(route, i) {
			route.id = i;
		});

		routes.forEach((e) => {
			//Make each route visible, by setting the opacity to 50%.
			map.setLayoutProperty('route' + e.id, 'visibility', 'visible');

			//Get GeoJson LineString feature of route
			var routeLine = polyline.toGeoJSON(e.geometry);

			//Update the data for the route, updating the visual.
			map.getSource('route' + e.id).setData(routeLine);

			var collision = '';
			var emoji = '';
			var clear = turf.booleanDisjoint(obstacle, routeLine);

			const routeDetail = {};

			if (clear == true) {
				collision = 'is good!';
				routeDetail['detail'] = 'does not go';
				emoji = '✔️';
				report.className = 'item';
				map.setPaintProperty('route' + e.id, 'line-color', '#74c476');
			} else {
				collision = 'is bad.';
				routeDetail['detail'] = 'goes';
				emoji = '⚠️';
				report.className = 'item warning';
				map.setPaintProperty('route' + e.id, 'line-color', '#DD0018');
			}

			//Add a new report section to the sidebar.
			// Assign a unique `id` to the report.
			report.id = 'report-' + e.id;

			// Add the response to the individual report created above.
			var heading = report.appendChild(document.createElement('h3'));

			// Set the class type based on clear value.
			if (clear == true) {
				heading.className = 'title';
			} else {
				heading.className = 'warning';
			}

			heading.innerHTML = emoji + ' Route ' + (e.id + 1) + ' ' + collision;

			// Add details to the individual report.
			var details = report.appendChild(document.createElement('div'));
			details.innerHTML = 'This route ' + routeDetail['detail'] + ' through an avoidance area.';
			report.appendChild(document.createElement('hr'));
		});
	});
};

const initMapbox = () => {
	const mapElement = document.getElementById('map');
	if (mapElement) {
		const map = buildMap(mapElement, 'map');
		const markers = JSON.parse(mapElement.dataset.markers);
		addMarkersToMap(map, markers);
		// fitMapToMarkers(map, markers);

		geolocate(map);

		directionsSearchBar(map);

		routeDisplay(map);
	}
};

export { initMapbox, buildMap };
