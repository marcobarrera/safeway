const share = () => {
	const buttonsList = document.querySelectorAll('.contact');
	buttonsList.forEach((button) => {
		button.addEventListener('click', (event) => {
			console.log('hello');
			navigator.geolocation.getCurrentPosition((data) => {
				let shareCoordinates = {
					lat: data.coords.latitude,
					lng: data.coords.longitude,
					userId: button.dataset.user,
					contactId: button.dataset.contact
				};
				console.log(shareCoordinates);
				// fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/-122.463%2C%2037.7648.json?access_token=pk.eyJ1Ijoic2t5bWFyaWFubmEiLCJhIjoiY2trc3RneDN5MTVyOTJ4bnkxZTJpMWV0byJ9.Z4PWkFsvZbFBb9B70rBBew`)
				fetch(`/locations`, {
					method: 'post',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(shareCoordinates)
				})
					.then((response) => response.json())
					.then((location) => {
						setInterval(() => {
							console.log('coordinates');
							navigator.geolocation.getCurrentPosition((data) => {
								console.log(data);
								let coordinates = {
									lat: data.coords.latitude,
									lng: data.coords.longitude,
									locationId: location.id
								};
								fetch(`/locations/${location.id}/coordinates`, {
									method: 'post',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(coordinates)
								});
							});
						}, 20000);
					});
			});
			// debugger
		});
	});
};

export { share };
