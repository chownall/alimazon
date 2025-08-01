// Fonctionnalités de la page d'accueil - Alimazon

class HomePage {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.autoPlayInterval = null;
    this.init();
  }

  init() {
    this.initHeroSlider();
    this.displayFeaturedProducts();
    this.displayNewProducts();
  }

  // Initialiser le slider hero
  initHeroSlider() {
    const sliderData = [
      {
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=600&fit=crop',
        title: 'Bienvenue sur Alimazon',
        subtitle: 'Découvrez des milliers de produits à des prix incroyables',
        link: 'products.html'
      },
      {
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&h=600&fit=crop',
        title: 'Nouvelle Collection',
        subtitle: 'Les dernières tendances à portée de clic',
        link: 'products.html?sort=newest'
      },
      {
        image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1600&h=600&fit=crop',
        title: 'Offres Spéciales',
        subtitle: 'Jusqu\'à -50% sur une sélection de produits',
        link: 'products.html?promo=true'
      }
    ];

    const heroSlider = document.querySelector('.hero__slider');
    if (!heroSlider) return;

    // Créer les slides
    heroSlider.innerHTML = '';
    sliderData.forEach((slide, index) => {
      const slideElement = this.createSlide(slide, index === 0);
      heroSlider.appendChild(slideElement);
    });

    this.slides = heroSlider.querySelectorAll('.hero__slide');

    // Initialiser les dots
    this.initSliderDots();

    // Démarrer l'autoplay
    this.startAutoPlay();

    // Gérer les événements de survol
    heroSlider.addEventListener('mouseenter', () => this.stopAutoPlay());
    heroSlider.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  // Créer un slide
  createSlide(data, isActive = false) {
    const slide = document.createElement('div');
    slide.className = `hero__slide ${isActive ? 'hero__slide--active' : ''}`;
    
    slide.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="hero__image">
      <div class="hero__content">
        <h1 class="hero__title">${data.title}</h1>
        <p class="hero__subtitle">${data.subtitle}</p>
        <a href="${data.link}" class="btn btn--primary btn--large">Découvrir maintenant</a>
      </div>
    `;
    
    return slide;
  }

  // Initialiser les dots du slider
  initSliderDots() {
    const dotsContainer = document.querySelector('.hero__dots');
    if (!dotsContainer || this.slides.length === 0) return;

    dotsContainer.innerHTML = '';
    
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `hero__dot ${index === 0 ? 'hero__dot--active' : ''}`;
      dot.setAttribute('data-slide', index);
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  // Aller à un slide spécifique
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    // Désactiver le slide actuel
    this.slides[this.currentSlide].classList.remove('hero__slide--active');
    document.querySelector(`.hero__dot[data-slide="${this.currentSlide}"]`)?.classList.remove('hero__dot--active');

    // Activer le nouveau slide
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('hero__slide--active');
    document.querySelector(`.hero__dot[data-slide="${this.currentSlide}"]`)?.classList.add('hero__dot--active');
  }

  // Passer au slide suivant
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  // Démarrer l'autoplay
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  // Arrêter l'autoplay
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  // Afficher les produits en vedette
  async displayFeaturedProducts() {
    if (window.productManager) {
      await window.productManager.displayFeaturedProducts('featuredProducts');
    }
  }

  // Afficher les nouveaux produits
  async displayNewProducts() {
    if (window.productManager) {
      await window.productManager.displayNewProducts('newProducts');
    }
  }

  // Initialiser la recherche
  initSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (query) {
          window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
      });

      // Recherche en temps réel avec debounce
      const debouncedSearch = window.utils.debounce((query) => {
        if (query.length >= 3) {
          this.showSearchSuggestions(query);
        } else {
          this.hideSearchSuggestions();
        }
      }, 300);

      searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });
    }
  }

  // Afficher les suggestions de recherche
  async showSearchSuggestions(query) {
    if (!window.productManager) return;

    const results = window.productManager.searchProducts(query).slice(0, 5);
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput || results.length === 0) {
      this.hideSearchSuggestions();
      return;
    }

    // Créer ou obtenir le conteneur de suggestions
    let suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) {
      suggestionsContainer = document.createElement('div');
      suggestionsContainer.id = 'searchSuggestions';
      suggestionsContainer.className = 'search-suggestions';
      searchInput.parentElement.appendChild(suggestionsContainer);
    }

    // Afficher les suggestions
    suggestionsContainer.innerHTML = results.map(product => `
      <a href="product.html?id=${product.id}" class="search-suggestion">
        <img src="${product.image}" alt="${product.name}" class="search-suggestion__image">
        <div class="search-suggestion__content">
          <h4 class="search-suggestion__title">${product.name}</h4>
          <p class="search-suggestion__price">${window.utils.formatPrice(product.price)}</p>
        </div>
      </a>
    `).join('');

    suggestionsContainer.classList.add('search-suggestions--visible');

    // Fermer les suggestions en cliquant ailleurs
    document.addEventListener('click', this.handleClickOutside);
  }

  // Masquer les suggestions de recherche
  hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
      suggestionsContainer.classList.remove('search-suggestions--visible');
    }
    document.removeEventListener('click', this.handleClickOutside);
  }

  // Gérer le clic en dehors des suggestions
  handleClickOutside = (e) => {
    const searchForm = document.querySelector('.search-form');
    if (searchForm && !searchForm.contains(e.target)) {
      this.hideSearchSuggestions();
    }
  }
}

// Initialiser la page d'accueil
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.hero')) {
    new HomePage();
  }
});