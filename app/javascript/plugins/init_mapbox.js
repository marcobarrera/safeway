import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { data } from 'jquery';

// const addMarkersToMap = (map, markers) => {
//   markers.forEach((marker) => {
//     const popup = new mapboxgl.Popup().setHTML(marker.infoWindow); // add this

//     new mapboxgl.Marker()
//       .setLngLat([ marker.lng, marker.lat ])
//       .setPopup(popup) // add this
//       .addTo(map);
//   });
// };

const fitMapToMarkers = (map, markers) => {
	if (markers.length) {
		const bounds = new mapboxgl.LngLatBounds();
		markers.forEach((marker) => bounds.extend([ marker.lng, marker.lat ]));
		map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
	}
};

let myCoords = {};

const myLocationButton = document.getElementById('myLocation');
const myLocation = myLocationButton.addEventListener('click', (event) => {
	navigator.geolocation.getCurrentPosition((data) => {
		myCoords['myLat'] = data.coords.latitude;
		myCoords['myLng'] = data.coords.longitude;
		initMapbox(myCoords['myLng'], myCoords['myLat']);
	});
});

const initMapbox = (myLng = -118.243683, myLat = 34.052235) => {
	const mapElement = document.getElementById('map');
	if (mapElement) {
		// only build a map if there's a div#map to inject into
		mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;

		const map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/light-v10',
			center: [ myLng, myLat ],
			zoom: 12
		});

		// set the bounds of the map
		// var bounds = [ [ 34.021122, -118.396469 ], [ 33.980530, -117.377022 ] ];
		// map.setMaxBounds(bounds);

		// initialize the map canvas to interact with later
		var canvas = map.getCanvasContainer();

		// an arbitrary start will always be the same
		// only the end or destination will change
		var start = [ myLng, myLat ];

		// create a function to make a directions request
		window.getRoute = (end) => {
			// make a directions request using walking profile
			// an arbitrary start will always be the same
			// only the end or destination will change
			var start = [ myLng, myLat ];
			map.setCenter(start);
			var url =
				'https://api.mapbox.com/directions/v5/mapbox/walking/' +
				start[0] +
				',' +
				start[1] +
				';' +
				end[0] +
				',' +
				end[1] +
				'?steps=true&geometries=geojson&access_token=' +
				mapboxgl.accessToken;

			// make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
			var req = new XMLHttpRequest();
			req.open('GET', url, true);
			req.onload = function() {
				var json = JSON.parse(req.response);
				var data = json.routes[0];
				var route = data.geometry.coordinates;
				var geojson = {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: route
					}
				};
				// if the route already exists on the map, reset it using setData
				if (map.getSource('route')) {
					map.getSource('route').setData(geojson);
				} else {
					// otherwise, make a new request
					map.addLayer({
						id: 'route',
						type: 'line',
						source: {
							type: 'geojson',
							data: {
								type: 'Feature',
								properties: {},
								geometry: {
									type: 'LineString',
									coordinates: geojson
								}
							}
						},
						layout: {
							'line-join': 'round',
							'line-cap': 'round'
						},
						paint: {
							'line-color': '#3887be',
							'line-width': 5,
							'line-opacity': 0.75
						}
					});
				}
				// add turn instructions here at the end
			};
			req.send();
		};

		map.on('load', function() {
			// make an initial directions request that
			// starts and ends at the same location
			getRoute(start);

			// Add starting point to the map
			map.addLayer({
				id: 'point',
				type: 'circle',
				source: {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: [
							{
								type: 'Feature',
								properties: {},
								geometry: {
									type: 'Point',
									coordinates: start
								}
							}
						]
					}
				},
				paint: {
					'circle-radius': 10,
					'circle-color': '#3887be'
				}
			});
			// this is where the code from the next step will go
		});
		const markers = JSON.parse(mapElement.dataset.markers);
		markers.forEach((marker) => {
			const popup = new mapboxgl.Popup().setHTML(marker.infoWindow);

			// Create a HTML element for your custom marker
			const element = document.createElement('div');
			element.className = 'marker';
			element.style.backgroundImage = `url('${marker.image_url}')`;
			element.style.backgroundSize = 'contain';
			element.style.width = '25px';
			element.style.height = '25px';
			new mapboxgl.Marker(element).setLngLat([ marker.lng, marker.lat ]).setPopup(popup).addTo(map);
		});

		// addMarkersToMap(map, markers);
		fitMapToMarkers(map, markers);
		const geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			mapboxgl: mapboxgl
		});
		geocoder.on('result', (event) => {
			window.getRoute(event.result.center);
		});
		map.addControl(geocoder);
	}
};

export { initMapbox };
