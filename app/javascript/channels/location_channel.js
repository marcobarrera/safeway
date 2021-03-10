import consumer from "./consumer";
import { buildMap } from '../plugins/init_mapbox'

const initLocationCable = () => {
  const mapElement = document.getElementById('coordinates'); // Map
  if (mapElement) {
    const id = mapElement.dataset.locationId;
    console.log(id)
    const map = buildMap(mapElement, 'coordinates') // Mapbox Map Instance
    
    const element = document.createElement('div');
    element.className = 'marker';
    element.style.backgroundImage = `url('https://res.cloudinary.com/titavon/image/upload/v1615417827/Group_31_uv33ly.png')`;
    element.style.backgroundSize = 'contain';
    element.style.width = '40px';
    element.style.height = '40px';

    consumer.subscriptions.create({ channel: "LocationChannel", id: id }, {
      received(data) { // Data is JSON
        const coordinate = JSON.parse(data) // JS object
        console.log(coordinate);
        new mapboxgl.Marker(element)
        .setLngLat([ coordinate.lng, coordinate.lat ])
        .addTo(map);
        map.flyTo({center:[ coordinate.lng, coordinate.lat ], zoom: 15})

      	
        // mapElement.insertAdjacentHTML('beforeend', data);
      },
    });
  }
}

export { initLocationCable };

