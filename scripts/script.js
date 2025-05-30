// Основной модуль приложения
const App = (function() {
  // Инициализация всех компонентов
  function init() {
    loadTeachers();
    initMainButtons();
    initReviewSlider();
    initAuthPopup();
    initPreloader();
  }

  // Загрузка данных преподавателей из JSON
  function loadTeachers() {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        renderTeachers(data);
      })
      .catch(error => console.error('Ошибка загрузки данных:', error));
  }

  // Рендеринг преподавателей
  function renderTeachers(teachersData) {
    const teachersContainer = document.querySelector('.prepods-list');

    if (!teachersContainer) {
      console.warn('Контейнер преподавателей не найден');
      return;
    }

    teachersContainer.innerHTML = '';

    for (const index in teachersData) {
      const teacher = teachersData[index];
      const teacherElement = document.createElement('div');
      teacherElement.className = 'prepod';

      teacherElement.innerHTML = `
        <img class="prepod-photo" src="${teacher.photo}" width="214" height="214" alt="${teacher.name}">
        <div class="prepod-info">
          <h3 class="prepod-name">${teacher.name}</h3>
          <p class="prepod-desc">Специализация: ${teacher.specialization}</p>
        </div>
      `;

      teachersContainer.appendChild(teacherElement);
    }

    console.log('Преподаватели успешно отображены');
  }

  // Инициализация предзагрузчика
  function initPreloader() {
    window.addEventListener('load', function() {
      setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        const content = document.querySelector('.content');

        if (preloader) preloader.style.display = 'none';
        if (content) content.style.display = 'block';
      }, 2000); // 2 секунды задержки для демонстрации
    });
  }

  // 2. Главные кнопки и попап "Подробнее"
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

    function closePopup(popupElement) {
      popupElement.style.display = 'none';
      document.body.style.overflow = '';
      console.log('Попап закрыт');
    }
  }

  // 3. Слайдер отзывов
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
      console.log(`Слайдер: текущая позиция ${currentIndex}, кнопки prev: ${!prevBtn.disabled}, next: ${!nextBtn.disabled}`);
    }

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

  // 4. Форма авторизации
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

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    } 

    function validatePassword(password) {
      return password.length >= 6;
    }

    function showError(element, message) {
      if (!element) return;
      element.textContent = message;
      element.style.display = 'block';
    }

    function hideError(element) {
      if (!element) return;
      element.textContent = '';
      element.style.display = 'none';
    }

    function openAuthPopup() {
      authPopup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeAuthPopup() {
      authPopup.style.display = 'none';
      document.body.style.overflow = '';

      if (loginForm) loginForm.reset();
      if (registerForm) registerForm.reset();

      document.querySelectorAll('.error-message').forEach(el => {
        hideError(el);
      });
    }

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
