/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/_components.js":
/*!*******************************!*\
  !*** ./src/js/_components.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/header.js */ "./src/js/components/header.js");
/* harmony import */ var _components_cards_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/cards.js */ "./src/js/components/cards.js");
// Компонент header с эффектом стекла

// Компонент для управления карточками игр


/***/ }),

/***/ "./src/js/components/cards.js":
/*!************************************!*\
  !*** ./src/js/components/cards.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions_throttle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions/throttle.js */ "./src/js/functions/throttle.js");
// Компонент для управления карточками игр

(function () {
  const cards = document?.querySelectorAll('.card');
  if (!cards.length) return;

  // Функция для вычисления позиции элемента относительно контейнера
  const getPositionRelativeToContainer = (element, container) => {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Вычисляем позицию относительно контейнера
    // Для абсолютного позиционирования относительно контейнера с position: relative
    // достаточно разницы между позициями элементов
    return {
      top: elementRect.top - containerRect.top,
      left: elementRect.left - containerRect.left,
      width: elementRect.width,
      height: elementRect.height
    };
  };

  // Функция для открытия card-more
  const openCardMore = (card, cardMore) => {
    // Находим контейнер категории
    const categoryContainer = card.closest('.category__container');
    if (!categoryContainer) return;

    // Перемещаем card-more в контейнер категории для правильного позиционирования
    if (cardMore.parentElement !== categoryContainer) {
      categoryContainer.appendChild(cardMore);
    }

    // Получаем позицию карточки относительно контейнера
    const cardPosition = getPositionRelativeToContainer(card, categoryContainer);
    const containerRect = categoryContainer.getBoundingClientRect();

    // Устанавливаем стили для card-more
    cardMore.style.width = `${containerRect.width}px`;
    cardMore.style.height = `${cardPosition.height}px`;
    cardMore.style.top = `${cardPosition.top}px`;
    cardMore.style.left = '0px';
    cardMore.style.position = 'absolute';

    // Устанавливаем opacity и pointer-events
    cardMore.style.opacity = '1';
    cardMore.style.pointerEvents = 'auto';

    // Добавляем класс активного состояния
    cardMore.classList.add('card-more--active');
    card.classList.add('card--active');

    // Сохраняем ссылку на исходную карточку
    cardMore.dataset.cardId = Array.from(cards).indexOf(card);
  };

  // Функция для закрытия card-more
  const closeCardMore = (cardMore, card) => {
    cardMore.style.opacity = '0';
    cardMore.style.pointerEvents = 'none';
    cardMore.classList.remove('card-more--active');

    // Очищаем стили позиционирования после завершения анимации
    setTimeout(() => {
      if (!cardMore.classList.contains('card-more--active')) {
        cardMore.style.width = '';
        cardMore.style.height = '';
        cardMore.style.top = '';
        cardMore.style.left = '';
        cardMore.style.position = '';

        // Возвращаем card-more обратно в карточку
        if (card && cardMore.parentElement !== card) {
          card.appendChild(cardMore);
        }
      }
    }, 300); // Время анимации opacity

    if (card) {
      card.classList.remove('card--active');
    }
  };

  // Обработка кликов по карточкам
  cards.forEach(card => {
    const cardMore = card.querySelector('.card-more');
    const openBtn = card.querySelector('.card__btn:not(.card__btn_more)');
    const closeBtn = cardMore?.querySelector('.card-more__close');
    if (!cardMore || !openBtn) return;

    // Обработчик открытия
    openBtn.addEventListener('click', e => {
      e.preventDefault();

      // Закрываем все открытые карточки
      document.querySelectorAll('.card-more--active').forEach(activeCardMore => {
        // Находим исходную карточку по индексу
        let activeCard = null;
        if (activeCardMore.dataset.cardId) {
          const cardIndex = parseInt(activeCardMore.dataset.cardId);
          activeCard = cards[cardIndex] || null;
        }
        // Если не нашли по индексу, пытаемся найти через closest
        if (!activeCard) {
          activeCard = activeCardMore.closest('.card');
        }
        closeCardMore(activeCardMore, activeCard);
      });

      // Открываем текущую карточку
      openCardMore(card, cardMore);
    });

    // Обработчик закрытия
    if (closeBtn) {
      closeBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        // Находим исходную карточку по индексу, если card-more уже перемещена
        let targetCard = card;
        if (cardMore.dataset.cardId) {
          const cardIndex = parseInt(cardMore.dataset.cardId);
          targetCard = cards[cardIndex] || card;
        }
        closeCardMore(cardMore, targetCard);
      });
    }
  });

  // Функция для обновления позиций всех открытых карточек
  const updateActiveCards = () => {
    document.querySelectorAll('.card-more--active').forEach(cardMore => {
      // Находим исходную карточку по индексу
      const cardIndex = cardMore.dataset.cardId;
      if (cardIndex !== undefined) {
        const card = cards[parseInt(cardIndex)];
        if (card) {
          openCardMore(card, cardMore);
        }
      }
    });
  };

  // Обработка ресайза для обновления позиций открытых карточек
  const throttledResize = (0,_functions_throttle_js__WEBPACK_IMPORTED_MODULE_0__.throttle)(updateActiveCards, 100);
  window.addEventListener('resize', throttledResize);

  // Обработка скролла для обновления позиций открытых карточек
  const throttledScroll = (0,_functions_throttle_js__WEBPACK_IMPORTED_MODULE_0__.throttle)(updateActiveCards, 50);
  window.addEventListener('scroll', throttledScroll);
})();

/***/ }),

/***/ "./src/js/components/header.js":
/*!*************************************!*\
  !*** ./src/js/components/header.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions_throttle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions/throttle.js */ "./src/js/functions/throttle.js");
// Компонент для эффекта стекла в header при скролле

(function () {
  const header = document?.querySelector(".header");
  if (!header) return;

  // Функция для обработки скролла
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Добавляем класс при скролле больше 50px
    if (scrollY > 50) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  // Используем throttle для оптимизации производительности
  const throttledHandleScroll = (0,_functions_throttle_js__WEBPACK_IMPORTED_MODULE_0__.throttle)(handleScroll, 100);

  // Обработчик события скролла
  window.addEventListener("scroll", throttledHandleScroll);

  // Проверяем начальное состояние при загрузке страницы
  handleScroll();
})();

/***/ }),

/***/ "./src/js/functions/throttle.js":
/*!**************************************!*\
  !*** ./src/js/functions/throttle.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   throttle: () => (/* binding */ throttle)
/* harmony export */ });
const throttle = (func, delay = 250) => {
  let isThrottled = false;
  let savedArgs = null;
  let savedThis = null;
  return function wrap(...args) {
    if (isThrottled) {
      savedArgs = args, savedThis = this;
      return;
    }
    func.apply(this, args);
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
      if (savedThis) {
        wrap.apply(savedThis, savedArgs);
        savedThis = null;
        savedArgs = null;
      }
    }, delay);
  };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_components.js */ "./src/js/_components.js");

})();

/******/ })()
;
//# sourceMappingURL=main.js.map