// Компонент для эффекта стекла в header при скролле
import { throttle } from "../functions/throttle.js";

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
  const throttledHandleScroll = throttle(handleScroll, 100);

  // Обработчик события скролла
  window.addEventListener("scroll", throttledHandleScroll);

  // Проверяем начальное состояние при загрузке страницы
  handleScroll();
})();
