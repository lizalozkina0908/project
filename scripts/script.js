/**
 * Основной модуль приложения
 * @namespace App
 */
const App = (function() {
  /**
   * Инициализация всех компонентов
   */
  function init() {
    initPreloader();
    loadTeachers();
    initMainButtons();
    initReviewSlider();
    initAuthPopup();
  }

  /**
   * Загрузка данных преподавателей из JSON
   */
  function loadTeachers() {
    fetch('data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        renderTeachers(data);
      })
      .catch(error => {
        console.error('Ошибка загрузки данных:', error);
        // Убедимся, что предзагрузчик скрыт даже в случае ошибки
        hidePreloader();
      });
  }

  /**
   * Рендеринг преподавателей
   * @param {Array} teachersData - Данные преподавателей
   */
  function renderTeachers(teachersData) {
    const teachersContainer = document.querySelector('.prepods-list');

    if (!teachersContainer) {
      console.error('Контейнер преподавателей не найден!');
      return;
    }

    teachersContainer.innerHTML = teachersData.map(teacher => `
      <div class="swiper-slide">
        <div class="prepod">
          <img class="prepod-photo" src="${teacher.photo}" width="214" height="214" alt="${teacher.name}">
          <div class="prepod-info">
            <h3 class="prepod-name">${teacher.name}</h3>
            <p class="prepod-desc">Специализация: ${teacher.specialization}</p>
          </div>
        </div>
      </div>
    `).join('');

    initSwiper();
    console.log('Преподаватели успешно отображены');
    hidePreloader(); // Скрываем предзагрузчик после рендеринга преподавателей
  }

  /**
   * Инициализация Swiper
   */
  function initSwiper() {
    new Swiper('.prepods-swiper', {
      slidesPerView: 3,
      spaceBetween: 30,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  /**
 * Инициализация предзагрузчика
 */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const content = document.querySelector('.content');

  if (preloader) preloader.style.display = 'flex';
  if (content) content.style.display = 'none';
}

/**
 * Скрытие предзагрузчика с задержкой
 */
function hidePreloader() {
  const preloader = document.querySelector('.preloader');
  const content = document.querySelector('.content');

  // Добавляем задержку 1 секунду (1000 миллисекунд) перед скрытием
  setTimeout(() => {
    if (preloader) preloader.style.display = 'none';
    if (content) content.style.display = 'block';
  }, 1000); // Можно увеличить это число для большей задержки
}

  /**
   * Инициализация главных кнопок и попап "Подробнее"
   */
  function initMainButtons() {
    const learnMoreBtn = document.querySelector('.beginning__button__right');
    const signupBtn = document.querySelector('.beginning__button');
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('closePopup');
    const overlay = document.querySelector('.popup__overlay');

    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        console.log("Кнопка 'Записаться' нажата!");
      });
    }

    if (learnMoreBtn && popup) {
      learnMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        console.log('Попап открыт');
      });
    }

    if (closeBtn && popup) {
      closeBtn.addEventListener('click', () => closePopup(popup));
    }

    if (overlay && popup) {
      overlay.addEventListener('click', () => closePopup(popup));
    }

    /**
     * Закрытие попапа
     * @param {HTMLElement} popupElement - Элемент попапа
     */
    function closePopup(popupElement) {
      popupElement.style.display = 'none';
      document.body.style.overflow = '';
      console.log('Попап закрыт');
    }
  }

  /**
   * Инициализация слайдера отзывов
   */
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

    /**
     * Обновление размеров слайдера
     */
    function updateDimensions() {
      const containerWidth = container.offsetWidth;
      const cardWidth = containerWidth / cardsToShow - 30;

      cards.forEach(card => {
        card.style.width = `${cardWidth}px`;
      });

      updateTrackPosition();
    }

    /**
     * Обновление позиции трека слайдера
     */
    function updateTrackPosition() {
      const containerWidth = container.offsetWidth;
      track.style.transform = `translateX(-${currentIndex * (containerWidth / cardsToShow)}px)`;
      updateButtons();
    }

    /**
     * Обновление состояния кнопок
     */
    function updateButtons() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= cards.length - cardsToShow;
      console.log(`Слайдер: текущая позиция ${currentIndex}, кнопки prev: ${!prevBtn.disabled}, next: ${!nextBtn.disabled}`);
    }

    /**
     * Получение количества карточек для отображения
     * @returns {number} Количество карточек для отображения
     */
    function getCardsToShowCount() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 992) return 2;
      return 3;
    }

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

    updateDimensions();
  }

  /**
   * Инициализация попапа авторизации
   */
  function initAuthPopup() {
    const authBtn = document.getElementById('authBtn');
    const authPopup = document.getElementById('authPopup');

    if (!authBtn || !authPopup) {
      console.warn('Элементы формы авторизации не найдены');
      return;
    }

    const closeBtn = authPopup.querySelector('.close-btn');
    const tabs = authPopup.querySelectorAll('.tab');
    const tabContents = authPopup.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    let users = JSON.parse(localStorage.getItem('users')) || [
      { name: "Админ", email: "admin@test.com", password: "admin123" }
    ];

    /**
     * Валидация email
     * @param {string} email - Email для валидации
     * @returns {boolean} Результат валидации
     */
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    /**
     * Валидация пароля
     * @param {string} password - Пароль для валидации
     * @returns {boolean} Результат валидации
     */
    function validatePassword(password) {
      return password.length >= 6;
    }

    /**
     * Показ ошибки
     * @param {HTMLElement} element - Элемент для отображения ошибки
     * @param {string} message - Сообщение об ошибке
     */
    function showError(element, message) {
      if (!element) return;
      element.textContent = message;
      element.style.display = 'block';
    }

    /**
     * Скрытие ошибки
     * @param {HTMLElement} element - Элемент ошибки
     */
    function hideError(element) {
      if (!element) return;
      element.textContent = '';
      element.style.display = 'none';
    }

    /**
     * Открытие попапа авторизации
     */
    function openAuthPopup() {
      authPopup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    /**
     * Закрытие попапа авторизации
     */
    function closeAuthPopup() {
      authPopup.style.display = 'none';
      document.body.style.overflow = '';

      if (loginForm) loginForm.reset();
      if (registerForm) registerForm.reset();

      document.querySelectorAll('.error-message').forEach(el => {
        hideError(el);
      });
    }

    /**
     * Переключение табов
     * @param {string} tabId - Идентификатор таба
     */
    function switchTab(tabId) {
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
      });

      tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
      });
    }

    authBtn.addEventListener('click', openAuthPopup);

    if (closeBtn) {
      closeBtn.addEventListener('click', closeAuthPopup);
    }

    authPopup.addEventListener('click', function(e) {
      if (e.target === authPopup) {
        closeAuthPopup();
      }
    });

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        switchTab(this.dataset.tab);
      });
    });

    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const emailError = document.getElementById('loginEmailError');
        const passwordError = document.getElementById('loginPasswordError');

        let isValid = true;

        if (!validateEmail(email)) {
          showError(emailError, "Введите корректный email");
          isValid = false;
        } else {
          hideError(emailError);
        }

        if (!validatePassword(password)) {
          showError(passwordError, "Пароль должен содержать минимум 6 символов");
          isValid = false;
        } else {
          hideError(passwordError);
        }

        if (isValid) {
          const user = users.find(u => u.email === email && u.password === password);

          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert(`Добро пожаловать, ${user.name}!`);
            closeAuthPopup();
          } else {
            showError(passwordError, "Неверный email или пароль");
          }
        }
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        const nameError = document.getElementById('registerNameError');
        const emailError = document.getElementById('registerEmailError');
        const passwordError = document.getElementById('registerPasswordError');
        const confirmPasswordError = document.getElementById('registerConfirmPasswordError');

        let isValid = true;

        if (name.length < 2) {
          showError(nameError, "Имя должно содержать минимум 2 символа");
          isValid = false;
        } else {
          hideError(nameError);
        }

        if (!validateEmail(email)) {
          showError(emailError, "Введите корректный email");
          isValid = false;
        } else if (users.some(u => u.email === email)) {
          showError(emailError, "Пользователь с таким email уже существует");
          isValid = false;
        } else {
          hideError(emailError);
        }

        if (!validatePassword(password)) {
          showError(passwordError, "Пароль должен содержать минимум 6 символов");
          isValid = false;
        } else {
          hideError(passwordError);
        }

        if (password !== confirmPassword) {
          showError(confirmPasswordError, "Пароли не совпадают");
          isValid = false;
        } else {
          hideError(confirmPasswordError);
        }

        if (isValid) {
          const newUser = { name, email, password };
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(newUser));

          alert(`Регистрация успешна, ${name}! Теперь вы можете войти.`);
          switchTab('login');
          registerForm.reset();
        }
      });
    }
  }

  return {
    init: init
  };
})();

// Запуск приложения
document.addEventListener('DOMContentLoaded', App.init);
