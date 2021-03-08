// 1. Add id to the alert button
// 2. Get the element by the id 
// 3. Add an event listener "click" to that elementwe need to create an empty hash for emergency coordinates
// 4. when we trigger the event we add the coordinates to the hash
// 5. we need to convert it to a json
// 6. we need to send to back end with fetch
// 7. find a route to do so (build a route)
// 8. parse it from Json to normal hash(array, string) and pass it to the notify method
const emergency = () => {
	const alertButton = document.getElementById('alertBtn');
	if (alertButton){
		console.log("alert click");
		alertButton.addEventListener('click', (event) => {
			navigator.geolocation.getCurrentPosition((data) => {
				let emergencyCoordinates = {myLat: data.coords.latitude, myLng: data.coords.longitude};
				console.log(emergencyCoordinates);
				// fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/-122.463%2C%2037.7648.json?access_token=pk.eyJ1Ijoic2t5bWFyaWFubmEiLCJhIjoiY2trc3RneDN5MTVyOTJ4bnkxZTJpMWV0byJ9.Z4PWkFsvZbFBb9B70rBBew`)
				fetch(`/alerts/notify`, {
					method: 'post',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(emergencyCoordinates)
				})
			});
			// debugger
		})
	}
};

export { emergency };