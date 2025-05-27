

// Проверка подключения 
console.log("Скрипт успешно подключен!");

// Глобальные переменные
const learnMoreBtn = document.querySelector('.beginning__button__right');
const signupBtn = document.querySelector('.beginning__button');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('closePopup');
const overlay = document.querySelector('.popup__overlay');

// Обработчики для главных кнопок
document.addEventListener('DOMContentLoaded', () => {
  // Обработчик для кнопки "Записаться"
  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      console.log("Кнопка 'Записаться' нажата!");
    });
  }

  // Обработчик для кнопки "Подробнее"
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', handleLearnMoreClick);
  }
});

// Логика попапа
/**
 * Блок-схема работы попапа:
 * [Начало]
 *   ↓
 * [Клик на "Узнать подробнее"?] → Нет → [Конец]
 *   ↓ Да
 * [Показать попап]
 *   ↓
 * [Клик на крестик или вне окна?] → Нет → Ждем
 *   ↓ Да
 * [Скрыть попап]
 *   ↓
 * [Конец]
 */

// Функция обработки клика по кнопке "Подробнее"
function handleLearnMoreClick(e) {
  e.preventDefault();
  popup.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
  console.log('Попап открыт');
}

// Закрытие попапа по крестику
if (closeBtn) {
  closeBtn.addEventListener('click', closePopup);
}

// Закрытие попапа по клику вне окна
if (overlay) {
  overlay.addEventListener('click', closePopup);
}

// Функция закрытия попапа
function closePopup() {
  popup.style.display = 'none';
  document.body.style.overflow = ''; // Восстанавливаем скролл
  console.log('Попап закрыт');
}

//  Слайдер отзывов 
/**
 * Блок-схема работы слайдера:
 * [Начало]
 *   ↓
 * [Инициализация элементов]
 *   ↓
 * [Расчет размеров карточек]
 *   ↓
 * [Настройка обработчиков]
 *   ↓
 * [Ожидание событий] → [Клик "Вперед"] → [Сдвиг влево]
 *   ↓                   [Клик "Назад"] → [Сдвиг вправо]
 * [Обновление состояния]
 *   ↓
 * [Конец]
 */

// Инициализация слайдера при загрузке страницы
document.addEventListener('DOMContentLoaded', initReviewSlider);

function initReviewSlider() {
  const track = document.querySelector('.reviews__track');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const cards = document.querySelectorAll('.review-card');
  const container = document.querySelector('.reviews__slider');
  
  if (!track || !prevBtn || !nextBtn || !cards.length || !container) {
    console.warn('Не найдены элементы слайдера');
    return;
  }

  let currentIndex = 0;
  let cardsToShow = getCardsToShowCount();

  // Основные функции слайдера
  function updateDimensions() {
    const containerWidth = container.offsetWidth;
    const cardWidth = containerWidth / cardsToShow - 30;
    
    cards.forEach(card => {
      card.style.width = `${cardWidth}px`;
    });
    
    updateTrackPosition();
  }

  function updateTrackPosition() {
    const containerWidth = container.offsetWidth;
    track.style.transform = `translateX(-${currentIndex * (containerWidth / cardsToShow)}px)`;
    updateButtons();
  }

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= cards.length - cardsToShow;
    console.log(`Слайдер: текущая позиция ${currentIndex}, кнопки prev: ${prevBtn.disabled}, next: ${nextBtn.disabled}`);
  }

  function getCardsToShowCount() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  }

  // Обработчики событий
  nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - cardsToShow) {
      currentIndex++;
      updateTrackPosition();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateTrackPosition();
    }
  });

  window.addEventListener('resize', () => {
    cardsToShow = getCardsToShowCount();
    updateDimensions();
  });

  // Инициализация
  updateDimensions();
}

//  Дополнительные обработчики 
// Пример дополнительного слушателя для демонстрации
document.querySelectorAll('.review-card').forEach((card, index) => {
  card.addEventListener('mouseover', () => {
    console.log(`Наведение на карточку отзыва #${index + 1}`);
  });
});
