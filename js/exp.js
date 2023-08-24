const closeModal = (event) => {
	const target = event.target;
	const code = event.code;

	if(event === 'close' || target === modalElem || code === "Escape") {
		modalElem.style.opacity = '0';
		
		setTimeout(() => {
			scrollService.enabledScroll();
			modalElem.style.visibility = 'hidden';

			if (close) {
				close();
			}
		}, time)

		window.removeEventListener('keydown', closeModal);
	}
}

const openModal = (e) => {
	if (open) {
		open({btn: e.target});
	}

	modalElem.style.visibility = 'visible';
	modalElem.style.opacity = '1';

	window.addEventListener('keydown', closeModal);
	scrollService.disabledScroll();
}
buttonElems.forEach(buttonElem => {
	buttonElem.addEventListener('click', openModal);
})