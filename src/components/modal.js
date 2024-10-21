const openModal = (popup) => {
  popup.classList.add('popup_is-opened');

  popup.addEventListener('click', closeByClick);
  document.addEventListener('keydown', closeByEsc);
};

const closeModal = (popup) => {
  popup.classList.remove('popup_is-opened');

  popup.addEventListener('click', closeByClick);
  document.removeEventListener('keydown', closeByEsc);
};

const closeByClick = (evt) => {
  if (
    evt.target.classList.contains('popup_is-opened') ||
    evt.target.classList.contains('popup__close')
  ) {
    const openedPopup = document.querySelector('.popup_is-opened');

    closeModal(openedPopup);
  }
};

const closeByEsc = (evt) => {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');

    closeModal(openedPopup);
  }
};

const renderLoading = (button, isLoading) => {
  if (isLoading) {
    button.textContent = 'Сохранение...';
    button.setAttribute('disabled', true);
  } else {
    button.textContent = 'Сохранить';
    button.removeAttribute('disabled');
  }
};

const makeButtonInactive = (button) => {
  button.classList.add('popup__button_disabled');
};

export { openModal, closeModal, renderLoading, makeButtonInactive };
