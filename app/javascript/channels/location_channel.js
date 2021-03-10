import consumer from "./consumer";

const initLocationCable = () => {
  const coordinatesContainer = document.getElementById('coordinates');
  if (coordinatesContainer) {
    const id = coordinatesContainer.dataset.locationId;

    consumer.subscriptions.create({ channel: "LocationChannel", id: id }, {
      received(data) {
      	console.log(data);
        coordinatesContainer.insertAdjacentHTML('beforeend', data);
      },
    });
  }
}

export { initLocationCable };