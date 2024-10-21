import {
  cardTemplate,
  userID,
  userName,
  placesList,
  image,
  openModal,
  imagePopup,
} from '..';
import { deleteUserCard, putLike, deleteLike } from '../api';

const createCard = (id, link, title, ownerID, likes) => {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  cardElement.id = id;
  cardElement.querySelector('.card__image').src = link;
  cardElement.querySelector('.card__title').textContent = title;

  if (ownerID === userID) {
    const deleteButton = cardElement.querySelector('.card__delete-button');

    deleteButton.removeAttribute('disabled');
    deleteButton.style.visibility = 'visible';
  }

  if (likes) {
    cardElement.querySelector('.card__likes-count').textContent = likes.length;

    likes.forEach((like) => {
      if (like.name === userName) {
        cardElement
          .querySelector('.card__like-button')
          .classList.add('card__like-button_is-active');
      }
    });
  }

  return cardElement;
};

const likeCard = (element) => {
  const card = element.closest('.card');
  const cardClassList = element.classList;
  const cardLikesCount = card.querySelector('.card__likes-count');

  if (cardClassList.contains('card__like-button_is-active')) {
    deleteLike(card.id)
      .then((data) => {
        cardLikesCount.textContent = data.likes.length;
        cardClassList.remove('card__like-button_is-active');
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    putLike(card.id)
      .then((data) => {
        cardLikesCount.textContent = data.likes.length;
        cardClassList.add('card__like-button_is-active');
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const deleteCard = (element) => {
  const card = element.closest('.card');

  deleteUserCard(card.id)
    .then(() => {
      placesList.removeChild(card);
    })
    .catch((err) => {
      console.log(err);
    });
};

const openCard = (element) => {
  image.src = element.src;

  openModal(imagePopup);
};

export { createCard, likeCard, deleteCard, openCard };
