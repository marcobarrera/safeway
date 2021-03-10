import consumer from "./consumer";
import { buildMap } from '../plugins/init_mapbox'

const initLocationCable = () => {
  const mapElement = document.getElementById('coordinates'); // Map
  if (mapElement) {
    const id = mapElement.dataset.locationId;
    console.log(id)
    const map = buildMap(mapElement, 'coordinates')
    consumer.subscriptions.create({ channel: "LocationChannel", id: id }, {
      received(data) { // Data is JSON
        const coordinate = JSON.parse(data)
        console.log(coordinate);
        new mapboxgl.Marker()
        .setLngLat([ coordinate.lng, coordinate.lat ])
        .addTo(map);

      	
        // mapElement.insertAdjacentHTML('beforeend', data);
      },
    });
  }
}

export { initLocationCable };