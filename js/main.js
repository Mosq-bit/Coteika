
const mobMenu = document.querySelector(".mob__menu");
const navList = document.querySelector(".header__nav-list");

if (mobMenu) {
  mobMenu.addEventListener("click", function () {
    console.log("Меню кликнуто"); // Для отладки

    this.classList.toggle("active");
    if (navList) {
      navList.classList.toggle("active");
    }
  });
}

class Slider {
  constructor(container) {
    this.slider = container;
    this.slides = this.slider.querySelectorAll(".slider__slide");
    this.prevBtn = this.slider.querySelector(".slider__prev");
    this.nextBtn = this.slider.querySelector(".slider__next");
    this.pagination = this.slider.querySelector(".slider__pagination");
    this.currentSlide = 0;

    this.init();
  }

  init() {
   
    this.createPagination();

  
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    this.updateSlider();
  }

  createPagination() {
    this.slides.forEach((_, index) => {
      const bullet = document.createElement("button");
      bullet.className = `slider__pagination-bullet ${
        index === 0 ? "active" : ""
      }`;
      bullet.addEventListener("click", () => this.goToSlide(index));
      this.pagination.appendChild(bullet);
    });
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlider();
  }

  next() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlider();
  }

  prev() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateSlider();
  }

  updateSlider() {
    const translateX = -this.currentSlide * 100;
    this.slider.querySelector(
      ".slider__container"
    ).style.transform = `translateX(${translateX}%)`;

  
    this.slider
      .querySelectorAll(".slider__pagination-bullet")
      .forEach((bullet, index) => {
        bullet.classList.toggle("active", index === this.currentSlide);
      });
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.querySelector(".slider");
  if (sliderContainer) {
    new Slider(sliderContainer);
  }
});

class ReviewsSlider {
  constructor(container) {
    this.slider = container;
    this.slidesContainer = this.slider.querySelector(
      ".reviews__slider-container"
    );
    this.slides = this.slider.querySelectorAll(".reviews__slide");
    this.prevBtn = this.slider.querySelector(".reviews__slider-prev");
    this.nextBtn = this.slider.querySelector(".reviews__slider-next");
    this.pagination = this.slider.querySelector(".reviews__slider-pagination");
    this.currentSlide = 0;
    this.slidesToShow = this.getSlidesToShow();

    this.init();
  }

  getSlidesToShow() {
    const width = window.innerWidth;
    if (width <= 576) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  init() {
    this.createPagination();
    this.addEventListeners();
    this.updateSlider();
    this.setupResizeListener();
  }

  createPagination() {
    const totalSlides = Math.ceil(this.slides.length / this.slidesToShow);

    for (let i = 0; i < totalSlides; i++) {
      const bullet = document.createElement("button");
      bullet.className = `reviews__slider-bullet ${i === 0 ? "active" : ""}`;
      bullet.addEventListener("click", () => this.goToSlide(i));
      this.pagination.appendChild(bullet);
    }
  }

  addEventListeners() {
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());
  }

  setupResizeListener() {
    window.addEventListener("resize", () => {
      const newSlidesToShow = this.getSlidesToShow();
      if (newSlidesToShow !== this.slidesToShow) {
        this.slidesToShow = newSlidesToShow;
        this.recreatePagination();
        this.updateSlider();
      }
    });
  }

  recreatePagination() {
    this.pagination.innerHTML = "";
    this.createPagination();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlider();
  }

  next() {
    const totalSlides = Math.ceil(this.slides.length / this.slidesToShow);
    this.currentSlide = (this.currentSlide + 1) % totalSlides;
    this.updateSlider();
  }

  prev() {
    const totalSlides = Math.ceil(this.slides.length / this.slidesToShow);
    this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides;
    this.updateSlider();
  }

  updateSlider() {
    const translateX = -this.currentSlide * 100;
    this.slidesContainer.style.transform = `translateX(${translateX}%)`;

  
    const bullets = this.slider.querySelectorAll(".reviews__slider-bullet");
    bullets.forEach((bullet, index) => {
      bullet.classList.toggle("active", index === this.currentSlide);
    });
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.querySelector(".reviews__slider");
  if (sliderContainer) {
    new ReviewsSlider(sliderContainer);
  }
});

class SortingManager {
    constructor() {
        this.sortButtons = document.querySelectorAll('.sorting__btn');
        this.roomCards = document.querySelectorAll('.room-card');
        this.currentSort = 'area';
        this.currentOrder = 'desc';
        this.onSortChange = null;
        
        this.init();
    }
    
    init() {
        this.sortButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleSortClick(btn));
        });
        
        // Устанавливаем начальную активную кнопку
        this.setInitialActiveButton();
    }
    
    setInitialActiveButton() {
        const initialBtn = document.querySelector('.sorting__btn[data-sort="area"]');
        if (initialBtn) {
            initialBtn.classList.add('active');
        }
    }
    
    handleSortClick(clickedBtn) {
        const sortType = clickedBtn.dataset.sort;
        const currentOrder = clickedBtn.dataset.order;
        
        // Определяем новый порядок
        const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
        
        // Обновляем активную кнопку
        this.updateActiveButton(clickedBtn, newOrder);
        
        // Сортируем карточки
        this.sortCards(sortType, newOrder);
        
        // Сохраняем текущие настройки
        this.currentSort = sortType;
        this.currentOrder = newOrder;
        
        // Вызываем колбэк если есть
        if (this.onSortChange) {
            this.onSortChange();
        }
    }
    
    updateActiveButton(activeBtn, newOrder) {
        // Сбрасываем все кнопки
        this.sortButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Активируем текущую кнопку
        activeBtn.classList.add('active');
        activeBtn.dataset.order = newOrder;
        
        // Обновляем стрелку
        const arrow = activeBtn.querySelector('.sorting__arrow');
        if (arrow) {
            arrow.textContent = newOrder === 'asc' ? '↑' : '↓';
        }
    }
    
    sortCards(sortType, order) {
        const cardsArray = Array.from(this.roomCards);
        
        cardsArray.sort((a, b) => {
            let valueA, valueB;
            
            if (sortType === 'price') {
                valueA = parseInt(a.dataset.price);
                valueB = parseInt(b.dataset.price);
            } else if (sortType === 'area') {
                valueA = parseFloat(a.dataset.area);
                valueB = parseFloat(b.dataset.area);
            }
            
            if (order === 'asc') {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });
        
        // Перемещаем карточки в DOM
        const resultsGrid = document.querySelector('.results__grid');
        if (resultsGrid) {
            cardsArray.forEach(card => {
                resultsGrid.appendChild(card);
            });
        }
    }
    
    sortVisibleCards(visibleCards) {
        const sortType = this.currentSort;
        const order = this.currentOrder;
        
        visibleCards.sort((a, b) => {
            let valueA, valueB;
            
            if (sortType === 'price') {
                valueA = parseInt(a.dataset.price);
                valueB = parseInt(b.dataset.price);
            } else if (sortType === 'area') {
                valueA = parseFloat(a.dataset.area);
                valueB = parseFloat(b.dataset.area);
            }
            
            if (order === 'asc') {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });
        
        // Перемещаем только видимые карточки
        const resultsGrid = document.querySelector('.results__grid');
        if (resultsGrid) {
            // Сначала добавляем все скрытые карточки
            Array.from(this.roomCards).forEach(card => {
                if (card.classList.contains('hidden')) {
                    resultsGrid.appendChild(card);
                }
            });
            
            // Затем добавляем отсортированные видимые карточки
            visibleCards.forEach(card => {
                resultsGrid.appendChild(card);
            });
        }
    }
}

class RoomFilter {
    constructor() {
        this.roomCards = document.querySelectorAll('.room-card');
        this.minPriceInput = document.querySelector('.min-price');
        this.maxPriceInput = document.querySelector('.max-price');
        this.areaCheckboxes = document.querySelectorAll('input[name="area"]');
        this.equipmentCheckboxes = document.querySelectorAll('input[name="equipment"]');
        this.resetButton = document.querySelector('.filter__reset');
        this.onFilterChange = null;
        
        this.init();
    }
    
    init() {
        // Добавляем обработчики событий
        if (this.minPriceInput) {
            this.minPriceInput.addEventListener('input', () => this.filterRooms());
        }
        
        if (this.maxPriceInput) {
            this.maxPriceInput.addEventListener('input', () => this.filterRooms());
        }
        
        this.areaCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.filterRooms());
        });
        
        this.equipmentCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.filterRooms());
        });
        
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetFilters());
        }
        
        // Первоначальная фильтрация
        this.filterRooms();
    }
    
    filterRooms() {
        const minPrice = parseInt(this.minPriceInput?.value) || 100;
        const maxPrice = parseInt(this.maxPriceInput?.value) || 600;
        
        const selectedAreas = Array.from(this.areaCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
            
        const selectedEquipment = Array.from(this.equipmentCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        this.roomCards.forEach(card => {
            const cardPrice = parseInt(card.dataset.price);
            const cardArea = card.dataset.area;
            const cardEquipment = card.dataset.equipment ? card.dataset.equipment.split(',') : [];
            
            // Проверяем соответствие фильтрам
            const priceMatch = cardPrice >= minPrice && cardPrice <= maxPrice;
            const areaMatch = selectedAreas.length === 0 || selectedAreas.includes(cardArea);
            const equipmentMatch = selectedEquipment.length === 0 || 
                                 selectedEquipment.some(equip => cardEquipment.includes(equip));
            
            // Показываем/скрываем карточку
            if (priceMatch && areaMatch && equipmentMatch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Вызываем колбэк если есть
        if (this.onFilterChange) {
            this.onFilterChange();
        }
    }
    
    resetFilters() {
        // Сбрасываем цены
        if (this.minPriceInput) this.minPriceInput.value = 100;
        if (this.maxPriceInput) this.maxPriceInput.value = 600;
        
        // Сбрасываем чекбоксы
        this.areaCheckboxes.forEach(checkbox => checkbox.checked = false);
        this.equipmentCheckboxes.forEach(checkbox => checkbox.checked = false);
        
        // Применяем фильтрацию
        this.filterRooms();
    }
}

class RoomManager {
    constructor() {
        this.roomCards = document.querySelectorAll('.room-card');
        this.sortingManager = new SortingManager();
        this.filterManager = new RoomFilter();
        
        this.init();
    }
    
    init() {
        // При изменении фильтров применяем сортировку
        this.filterManager.onFilterChange = () => {
            this.applySorting();
        };
        
        // При изменении сортировки обновляем порядок
        this.sortingManager.onSortChange = () => {
            this.applySorting();
        };
    }
    
    applySorting() {
        const visibleCards = Array.from(this.roomCards).filter(card => 
            !card.classList.contains('hidden')
        );
        
        this.sortingManager.sortVisibleCards(visibleCards);
    }
}

// Ин ициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    new RoomManager();
    console.log('RoomManager initialized');
});

// Функция для открытия модального окна
function openModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Функция для открытия окна успеха
function openSuccessModal() {
  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Функция для закрытия модального окна
function closeModal() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  // Находим все кнопки "Забронировать"
  const bookingButtons = document.querySelectorAll('.numbers-page__btn, .number__btn, .hero__btn, .saler__btn');
  
  // Добавляем обработчики на кнопки
  bookingButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  });
  
  // Закрытие по кнопке
  const closeButtons = document.querySelectorAll('.modal__close, #successCloseBtn');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Закрытие по клику на оверлей
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  });
  
  // Закрытие по ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  // Обработка формы
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Здесь можно добавить логику отправки формы на сервер
      // Например:
      // const formData = new FormData(this);
      // fetch('/booking', { method: 'POST', body: formData })
      //   .then(response => response.json())
      //   .then(data => {
      //     if (data.success) {
      //       closeModal();
      //       openSuccessModal();
      //     }
      //   });
      
      // Временно просто показываем успех
      closeModal();
      openSuccessModal();
    });
  }
});