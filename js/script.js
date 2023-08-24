/* Работа с сервером */
const API_URL = "https://workspace-methed.vercel.app/";
const LOCATION_URL = "api/locations";
const VACANCY_URL = 'api/vacancy';

const pagination = {};
const cardList = document.querySelector('.cards__list'); 

let lastUrl = '';

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
	const salaryFormat = `${parseInt(salary).toLocaleString()}`;
	
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

/* Создание карточки li.cards__item и её наполнение */
const createCards = data => data.vacancies.map(vacancy => {
	const li = document.createElement('li');
	li.classList.add('cards__item');
	li.insertAdjacentHTML('beforeend', createCard(vacancy));

	return li;
});

/* Добавление карточек в ul.cards__list */
const renderVacancy = (data) => {
	const cardList = document.querySelector('.cards__list'); 
	cardList.textContent = '';

	const cards = createCards(data);

	cardList.append(...cards);

	if (data.pagination) {
		Object.assign(pagination, data.pagination);
	}

	observer.observe(cardList.lastElementChild);
};

/* Добавление дополнительных вакансий */
const renderMoreVacancies = data => {
	const cards = createCards(data);

	cardList.append(...cards);

	if (data.pagination) {
		Object.assign(pagination, data.pagination);
	}

	observer.observe(cardList.lastElementChild);
};

/* Загрузка дополнительных вакансий */
const loadMoreVacancies = () => {
	if (pagination.totalPages > pagination.currentPage) {
		const urlWithParams = new URL(lastUrl);
	
		urlWithParams.searchParams.set('page', pagination.currentPage + 1);
		urlWithParams.searchParams.set('limit', window.innerWidth < 768 ? 6 : 12);

		getData(urlWithParams, renderMoreVacancies, renderError).then(() => {
			lastUrl = urlWithParams;
		});
	}
};

/* Открытие модалки */
const openModal = id => {
	getData(`${API_URL}${VACANCY_URL}/${id}`,
	renderModal,
	renderError,
)};

const createDetailVacancy = data => {
	const {
		id, 
		title, 
		company, 
		description, 
		email, 
		salary, 
		type, 
		format, 
		experience, 
		location, 
		logo
	} = data;

	const srcImg = `${API_URL}${logo}`;
	const salaryFormat = `${parseInt(salary).toLocaleString()}`;
	
	return `
	<article class="detail">
		<div class="detail__header">
			<img class="detail__logo" src="${srcImg}" alt="Логотип компании ${company}">

			<p class="detail__company">${company}</p>
			<h2 class="detail__title">${title}</h2>
		</div>

		<div class="detail__main">
			<p class="detail__description">
				${description.replaceAll('\n', '<br>')}
			</p>

			<ul class="detail__fields">
				<li class="detail__field">от ${salaryFormat}₽</li>
				<li class="detail__field">${type}</li>
				<li class="detail__field">${format}</li>
				<li class="detail__field">${experience}</li>
				<li class="detail__field">${location}</li>
			</ul>
		</div>

		<p class="detail__resume">
			Отправляйте резюме на 
			<a class="blue-text" href="mailto:${email}">${email}</a>
		</p>
	</article>
`};

/* Добавление модального окна в body */
const renderModal = data => {
	const modal = document.createElement('div');
	modal.classList.add('modal'); 
	
	const modalMain = document.createElement('div');
	modalMain.classList.add('modal__main');

	const modalClose = document.createElement('button');
	modalClose.classList.add('modal__close');
	modalClose.innerHTML = `
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_8_382)">
			<path d="M10.7831 10L15.3887 5.39444C15.4797 5.28816 15.5272 5.15145 15.5218 5.01163C15.5164 4.87181 15.4585 4.73918 15.3595 4.64024C15.2606 4.5413 15.128 4.48334 14.9881 4.47794C14.8483 4.47254 14.7116 4.52009 14.6053 4.61111L9.99977 9.21666L5.39421 4.60555C5.2896 4.50094 5.14771 4.44217 4.99977 4.44217C4.85182 4.44217 4.70994 4.50094 4.60532 4.60555C4.50071 4.71017 4.44194 4.85205 4.44194 5C4.44194 5.14794 4.50071 5.28983 4.60532 5.39444L9.21643 10L4.60532 14.6056C4.54717 14.6554 4.49993 14.7166 4.46659 14.7856C4.43324 14.8545 4.4145 14.9296 4.41155 15.0061C4.40859 15.0826 4.42148 15.1589 4.44941 15.2302C4.47734 15.3015 4.51971 15.3662 4.57385 15.4204C4.62799 15.4745 4.69274 15.5169 4.76403 15.5448C4.83532 15.5727 4.91162 15.5856 4.98813 15.5827C5.06464 15.5797 5.13972 15.561 5.20864 15.5276C5.27757 15.4943 5.33885 15.447 5.38866 15.3889L9.99977 10.7833L14.6053 15.3889C14.7116 15.4799 14.8483 15.5275 14.9881 15.5221C15.128 15.5167 15.2606 15.4587 15.3595 15.3598C15.4585 15.2608 15.5164 15.1282 15.5218 14.9884C15.5272 14.8485 15.4797 14.7118 15.3887 14.6056L10.7831 10Z" fill="#CCCCCC"/>
		</g>
	</svg>
	`;


	modalMain.innerHTML = createDetailVacancy(data);

	modal.append(modalMain);
	modalMain.append(modalClose);

	document.body.append(modal);

	/* Закрытие модального окна */
	modal.addEventListener('click', ({target}) => {
		if (target === modal || target.closest('.modal__close')) {
			modal.remove();
		}
	});
}

const openFilter = () => {
	const vacancyFilter = document.querySelector('.vacancies__filter');
	const filterBtnOpen = document.querySelector('.vacancies__filter-btn');

	filterBtnOpen.addEventListener('click', () => {
		filterBtnOpen.classList.toggle('vacancies__filter-btn_open');
		vacancyFilter.classList.toggle('vacancies__filter_active');
	});
};

openFilter()

/* Смотритель */
const observer = new IntersectionObserver(
	entries => {
		entries.forEach(entry => {
			/* Если элемет видимый */
			if (entry.isIntersecting) {
				loadMoreVacancies();
			}
		})
	}, {
		rootMargin: '100px',
	}
);

/* Инициализация при запуске приложения */
const init = () => {
	const filterForm = document.querySelector('.filter__form');

	/*  Работа с choices.js */
	const citySelect = document.querySelector('#city');
	const cityChoices = new Choices(citySelect, {
		// searchEnabled: false,
		itemSelectText: '',
		position: 'bottom',
	});

	placeholderItem = cityChoices._getTemplate( 'placeholder', 'Выбрать город' ); 
	cityChoices.itemList.append(placeholderItem)

	// Удаляем все option в HTML

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
			
			// <--- РЕШЕНИЕ ПРОБЛЕМЫ С RESET --->
			/* При нажатии на кнопку "очистить" */
			filterForm.addEventListener('reset', (ev) => {
				/* Добавляем placeholder */
				placeholderItem = cityChoices._getTemplate( 'placeholder', 'Выбрать город' ); 
				cityChoices.itemList.append(placeholderItem)

				/* Рендерим заново выпадающий список */
				cityChoices.setChoices(
					locations,
					'value',
					'label',
					true
				);
			})
		}, 

		(err) => console.log(err)
	);


	const urlWithParams = new URL(`${API_URL}${VACANCY_URL}`);

	
	urlWithParams.searchParams.set('limit', window.innerWidth < 768 ? 6 : 12);

	/* Получение вакансий */
	getData(urlWithParams, renderVacancy, renderError).then(() => {
		lastUrl = urlWithParams;
	});

	/* Открытие модального окна по клику на вакансию */
	cardList.addEventListener('click', ({target}) => {
		const vacancyCard = target.closest('.vacancy');

		if(vacancyCard) {
			const vacancyId = vacancyCard.dataset.id;

			openModal(vacancyId);
		}
	});

	/* Работа фильтра */
	filterForm.addEventListener('submit', event => {
		event.preventDefault();

		const formData = new FormData(filterForm);
		const urlWithParam = new URL(`${API_URL}${VACANCY_URL}`);

		formData.forEach((value, key) => {
			urlWithParam.searchParams.append(key, value);
		});

		getData(urlWithParam, renderVacancy, renderError).then(() => {
			lastUrl = urlWithParam;
			observer.observe(cardList)
		});
	});
}

init();

// getData(`${API_URL}${VACANCY_URL}`, (data) => { console.log(data)}, renderError);
// document.body.append(document.createElement('div'))