/* Работа с сервером */
const API_URL = "https://workspace-methed.vercel.app/";
const LOCATION_URL = "api/locations";
const VACANCY_URL = 'api/vacancy';

const cardList = document.querySelector('.cards__list'); 

/* Ф-ия для получения данных */
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

/* Ф-ия отображения ошибки */
const renderError = err => { 
	console.log(err);
}

/* Наполнение карточки */
const createCard = vacancy => {
	const {logo, id, title, company, salary, type, format, experience} = vacancy;	

	const srcImg = `${API_URL}${logo}`;
	const salaryFormat = `${parseInt(salary).toLocaleString()}`
	
	return `
		<article class="vacancy" tabindex="0" data-id="${id}">
		<img class="vacancy__logo"  height="44" src="${srcImg}" alt="Логотип компании ${company}">
		<p class="vacancy__company">${company}</p>
		<h3 class="vacancy__title">${title}</h3>
		<ul class="vacancy__fields">
			<li class="vacancy__field">от ${salaryFormat}₽</li>
			<li class="vacancy__field">${format}</li>
			<li class="vacancy__field">${type}</li>
			<li class="vacancy__field">${experience}</li>
		</ul>
		</article>
	`
};

/*
	Пример прихода данных vacancy
	
	vacancy {
		company: "Creative People"
		description: "Привет. Мы в CreativePeople ищем middle графического дизайнера в свою дизайн команду. Удаленно, из любой точки нашей страны, где у вас будет хороший интернет. Опыт работы в разработке логотипов, фирменных стилей обязателен.\nУ нас в портфолио много крупных российских компаний, с некоторыми мы работаем уже много лет и делаем самые разные проекты, от сайтов до мобильных приложений."
		email: "CreativePeople@gmail.com"
		experience: "от 1 года до 3-х лет"
		format: "гибкий"
		id: "lkxsnh8av9pk5a"
		location: "Москва"
		logo: "img/lkxsnh8av9pk5a.png"
		salary: "110000"
		title: "Графический дизайнер"
		type: "проектная работа"
	}
*/

/* Создание карточки li.cards__item и её наполнение */
const createCards = data => data.vacancies.map(vacancy => {
	const li = document.createElement('li');
	li.classList.add('cards__item');
	li.insertAdjacentHTML('beforeend', createCard(vacancy));

	return li;
});

/* Добавление карточек в ul.cards__list */
const renderVacancy = data => {
	cardList.textContent = '';

	const cards = createCards(data);

	cardList.append(...cards);
}

/* Инициализация при запуске приложения */
const init = () => {
	/*  Работа с choices.js */
	const citySelect = document.querySelector('#city');

	const cityChoices = new Choices(citySelect, {
		// searchEnabled: false,
		itemSelectText: '',
	});

	/*  Получение городов */
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
	
	const url = new URL(`${API_URL}${VACANCY_URL}`)
	
	/* 
		Получение вакансий
	*/
	getData(url, renderVacancy, renderError);
}

init();

getData(`${API_URL}${VACANCY_URL}`, (data) => { console.log(data)}, renderError);
