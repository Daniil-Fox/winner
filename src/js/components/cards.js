// Компонент для управления карточками игр
import { throttle } from '../functions/throttle.js';

(function() {
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
    openBtn.addEventListener('click', (e) => {
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
      closeBtn.addEventListener('click', (e) => {
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
  const throttledResize = throttle(updateActiveCards, 100);
  window.addEventListener('resize', throttledResize);
  
  // Обработка скролла для обновления позиций открытых карточек
  const throttledScroll = throttle(updateActiveCards, 50);
  window.addEventListener('scroll', throttledScroll);
})();

