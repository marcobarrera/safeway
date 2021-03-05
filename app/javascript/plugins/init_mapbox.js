import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { data } from 'jquery';

let myCoords = {};

const myLocationButton = document.getElementById('myLocation');
const myLocation = myLocationButton.addEventListener('click', (event) => {
	navigator.geolocation.getCurrentPosition((data) => {
		console.log(data);
		myCoords['myLat'] = data.coords.latitude;
		myCoords['myLng'] = data.coords.longitude;
		initMapbox(myCoords['myLng'], myCoords['myLat']);
	});
});

const initMapbox = (a = -118.243683, b = 34.052235) => {
	const mapElement = document.getElementById('map');
	if (mapElement) {
		// only build a map if there's a div#map to inject into
		mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;

		const map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/light-v10',
			center: [ a, b ],
			zoom: 14
		});

		var nav = new mapboxgl.NavigationControl();

		var directions = new MapboxDirections({
			accessToken: mapboxgl.accessToken,
			unit: 'metric',
			profile: 'mapbox/cycling',
			alternatives: 'true',
			geometries: 'geojson'
		});

		map.scrollZoom.enable();
		map.addControl(directions, 'top-right');

		var clearances = {
			type: 'FeatureCollection',
			features: []
		};

		for (let alert of gon.alerts) {
			clearances.features.push({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [ alert.longitude, alert.latitude ]
				}
			});
		}

		var obstacle = turf.buffer(clearances, 0.03, { units: 'kilometers' });

		map.on('load', function(e) {
			map.loadImage(
				'https://3oecq13pb7a518hqscs13jv9-wpengine.netdna-ssl.com/wp-content/uploads/2014/01/alert-icon-red-11.png',
				function(error, image) {
					if (error) throw error;
					map.addImage('cat', image);
					map.addSource('point', {
						type: 'geojson',
						data: clearances
					});

					map.addLayer({
						id: 'clearances',
						type: 'symbol',
						source: 'point',
						layout: {
							'icon-image': 'cat',
							'icon-size': 0.1
						}
					});
				}
			);

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
					map.setPaintProperty('route' + e.id, 'line-color', '#de2d26');
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
	}
};

export { initMapbox };
