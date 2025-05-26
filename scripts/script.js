// Проверка подключения
console.log("Скрипт работает!"); 

// Обработчики для кнопок (пример)
document.addEventListener('DOMContentLoaded', () => {
  const signupBtn = document.querySelector('.beginning__button');
  const detailsBtn = document.querySelector('.beginning__button__right');

  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      console.log("Кнопка 'Записаться' нажата!");
    });
  }

  if (detailsBtn) {
    detailsBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Если это ссылка с href="#"
      console.log("Кнопка 'Подробнее' нажата!");
      // Здесь логика попапа
    });
  }
});