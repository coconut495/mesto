import './pages/index.css';

import {
  openModal,
  closeModal,
  renderLoading,
  makeButtonInactive,
} from './components/modal';
import { enableValidation } from './components/validate';
import { createCard, likeCard, deleteCard, openCard } from './components/card';
import {
  getProfile,
  patchAvatar,
  patchProfile,
  getInitialCards,
  postCard,
} from './api';

var userID;
var userName;

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// DOM Elements
const cardTemplate = document.querySelector('#card-template').content;

const profileImage = document.querySelector('.profile__image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const placesList = document.querySelector('.places__list');

const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarFormElement = document.forms['edit-avatar'];
const avatarLinkInput = avatarFormElement.elements.link;

const profilePopup = document.querySelector('.popup_type_edit');
const profileFormElement = document.forms['edit-profile'];
const nameInput = profileFormElement.elements.name;
const jobInput = profileFormElement.elements.description;

const cardPopup = document.querySelector('.popup_type_new-card');
const cardFormElement = document.forms['new-place'];
const titleInput = cardFormElement.elements['place-name'];
const linkInput = cardFormElement.elements.link;

const imagePopup = document.querySelector('.popup_type_image');
const image = imagePopup.querySelector('.popup__image');

const avatarEditButton = document.querySelector('.profile__image-container');
const avatarSubmitButton = avatarFormElement.elements[1];
const profileEditButton = document.querySelector('.profile__edit-button');
const profileSubmitButton = profileFormElement.elements[2];
const profileAddButton = document.querySelector('.profile__add-button');
const cardSubmitButton = cardFormElement.elements[2];

// Handlers
const handleOpenAvatarForm = () => {
  openModal(avatarPopup);
};

const handleAvatarFormSubmit = (evt) => {
  renderLoading(avatarSubmitButton, true);

  patchAvatar(avatarLinkInput.value)
    .then((data) => {
      profileImage.src = data.avatar;
      closeModal(avatarPopup);
      avatarFormElement.reset();
      makeButtonInactive(avatarSubmitButton);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(avatarSubmitButton, false);
    });
};

const handleCardOperations = (evt) => {
  const element = evt.target;

  if (element.classList.contains('card__like-button')) {
    likeCard(element);
  } else if (element.classList.contains('card__delete-button')) {
    deleteCard(element);
  } else if (element.classList.contains('card__image')) {
    openCard(element);
  }
};

const handleOpenProfileForm = () => {
  nameInput.value = document.querySelector('.profile__title').textContent;
  jobInput.value = document.querySelector('.profile__description').textContent;

  openModal(profilePopup);
};

const handleProfileFormSubmit = (evt) => {
  renderLoading(profileSubmitButton, true);

  patchProfile(nameInput.value, jobInput.value)
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(profilePopup);
      makeButtonInactive(profileSubmitButton);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(profileSubmitButton, false);
    });
};

const handleOpenCardForm = () => {
  openModal(cardPopup);
};

const handleCardFormSubmit = (evt) => {
  renderLoading(cardSubmitButton, true);

  postCard(titleInput.value, linkInput.value)
    .then((data) => {
      placesList.prepend(
        createCard(
          data._id,
          data.link,
          data.name,
          data.owner._id,
          data.likes.length
        )
      );
      closeModal(cardPopup);
      cardFormElement.reset();
      makeButtonInactive(cardSubmitButton);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(cardSubmitButton, false);
    });
};

// Event Listeners
avatarEditButton.addEventListener('click', handleOpenAvatarForm);
avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);

placesList.addEventListener('click', handleCardOperations);

profileEditButton.addEventListener('click', handleOpenProfileForm);
profileFormElement.addEventListener('submit', handleProfileFormSubmit);

profileAddButton.addEventListener('click', handleOpenCardForm);
cardFormElement.addEventListener('submit', handleCardFormSubmit);

// Manipulations
await getProfile()
  .then((data) => {
    userID = data._id;
    userName = data.name;
    profileImage.src = data.avatar;
    profileTitle.textContent = data.name;
    profileDescription.textContent = data.about;
  })
  .catch((err) => {
    console.log(err);
  });

getInitialCards()
  .then((cards) => {
    cards.forEach((card) => {
      placesList.append(
        createCard(card._id, card.link, card.name, card.owner._id, card.likes)
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });

enableValidation(validationSettings);

export {
  cardTemplate,
  userID,
  userName,
  placesList,
  image,
  openModal,
  imagePopup,
};
