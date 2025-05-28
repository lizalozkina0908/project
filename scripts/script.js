
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


document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const authBtn = document.getElementById('authBtn');
    const authPopup = document.getElementById('authPopup');
    const closeBtn = document.querySelector('.close-btn');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Пользовательские данные (имитация базы данных)
    let users = JSON.parse(localStorage.getItem('users')) || [
        { name: "Админ", email: "admin@test.com", password: "admin123" }
    ];

    // Функции валидации
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function hideError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    // Управление попапом
    function openPopup() {
        authPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        authPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Сброс форм при закрытии
        loginForm.reset();
        registerForm.reset();
        
        // Скрытие сообщений об ошибках
        document.querySelectorAll('.error-message').forEach(el => {
            hideError(el);
        });
    }

    // Переключение вкладок
    function switchTab(tabId) {
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }

    // Обработчики событий
    authBtn.addEventListener('click', openPopup);
    closeBtn.addEventListener('click', closePopup);

    authPopup.addEventListener('click', function(e) {
        if (e.target === authPopup) {
            closePopup();
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Обработка формы входа
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const emailError = document.getElementById('loginEmailError');
        const passwordError = document.getElementById('loginPasswordError');
        
        let isValid = true;
        
        // Валидация email
        if (!validateEmail(email)) {
            showError(emailError, "Введите корректный email");
            isValid = false;
        } else {
            hideError(emailError);
        }
        
        // Валидация пароля
        if (!validatePassword(password)) {
            showError(passwordError, "Пароль должен содержать минимум 6 символов");
            isValid = false;
        } else {
            hideError(passwordError);
        }
        
        if (isValid) {
            // Проверка существования пользователя
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                alert(`Добро пожаловать, ${user.name}!`);
                closePopup();
            } else {
                showError(passwordError, "Неверный email или пароль");
            }
        }
    });

    // Обработка формы регистрации
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
        
        // Валидация имени
        if (name.length < 2) {
            showError(nameError, "Имя должно содержать минимум 2 символа");
            isValid = false;
        } else {
            hideError(nameError);
        }
        
        // Валидация email
        if (!validateEmail(email)) {
            showError(emailError, "Введите корректный email");
            isValid = false;
        } else if (users.some(u => u.email === email)) {
            showError(emailError, "Пользователь с таким email уже существует");
            isValid = false;
        } else {
            hideError(emailError);
        }
        
        // Валидация пароля
        if (!validatePassword(password)) {
            showError(passwordError, "Пароль должен содержать минимум 6 символов");
            isValid = false;
        } else {
            hideError(passwordError);
        }
        
        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            showError(confirmPasswordError, "Пароли не совпадают");
            isValid = false;
        } else {
            hideError(confirmPasswordError);
        }
        
        if (isValid) {
            // Добавление нового пользователя
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert(`Регистрация успешна, ${name}! Теперь вы можете войти.`);
            switchTab('login');
            registerForm.reset();
        }
    });
});
