/* 
	Работа с сервером
*/
const API_URL = "https://workspace-methed.vercel.app/";
const LOCATION_URL = "api/locations";

/* 
	Ф-ия для получения данных
*/
const getData = async (url, cbSuccess, cbError) => {
	try {
		const response = await fetch(url);
		const data = await response.json();
		
		cbSuccess(data);
	}
	catch(err) {
		console.log(err);
	}
}

/* 
	Инициализация при запуске приложения
*/
const init = () => {
	/* 
		Работа с choices.js
	*/
	const citySelect = document.querySelector('#city');

	const cityChoices = new Choices(citySelect, {
		// searchEnabled: false,
		itemSelectText: '',
	});

	/* 
		Получение городов
	*/
	getData(
		`${API_URL}${LOCATION_URL}`,
		
		// Перебор массива для проебразования в нужный формат для choices.setChoices
		(locationData) => {
			const locations = locationData.map((location) => ({value: location,}));

			// Добавляем в choices данные которые приходят с сервера
			cityChoices.setChoices(
				locations,
				'value',
				'label',
				true
			)
		}, 

		(err) => console.log(err)
	);
	
}

init();


