// Page de produits - Alimazon

class ProductsPage {
  constructor() {
    this.filters = {
      category: null,
      minPrice: null,
      maxPrice: null,
      onSale: false,
      new: false,
      inStock: true,
      minRating: null,
      search: null,
      sort: null
    };
    
    this.products = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.productsPerPage = 12;
    
    this.init();
  }

  async init() {
    // Charger les paramètres de l'URL
    this.loadUrlParams();
    
    // Charger les produits
    await this.loadProducts();
    
    // Initialiser les filtres
    this.initFilters();
    
    // Initialiser les événements
    this.initEvents();
    
    // Appliquer les filtres et afficher les produits
    this.applyFilters();
  }

  // Charger les paramètres depuis l'URL
  loadUrlParams() {
    const params = window.utils.getUrlParams();
    
    if (params.category) {
      this.filters.category = params.category;
    }
    
    if (params.search) {
      this.filters.search = params.search;
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = params.search;
      }
    }
    
    if (params.promo === 'true') {
      this.filters.onSale = true;
    }
    
    if (params.sort) {
      this.filters.sort = params.sort;
      const sortSelect = document.getElementById('sortSelect');
      if (sortSelect) {
        sortSelect.value = params.sort;
      }
    }
  }

  // Charger les produits
  async loadProducts() {
    if (window.productManager) {
      await window.productManager.loadProducts();
      this.products = window.productManager.getAllProducts();
    }
  }

  // Initialiser les filtres
  initFilters() {
    // Charger les catégories
    this.loadCategories();
    
    // Mettre à jour l'état des filtres
    if (this.filters.onSale) {
      const filterOnSale = document.getElementById('filterOnSale');
      if (filterOnSale) filterOnSale.checked = true;
    }
    
    if (this.filters.new) {
      const filterNew = document.getElementById('filterNew');
      if (filterNew) filterNew.checked = true;
    }
    
    if (this.filters.inStock) {
      const filterInStock = document.getElementById('filterInStock');
      if (filterInStock) filterInStock.checked = true;
    }
  }

  // Charger les catégories dans le filtre
  loadCategories() {
    const categoriesFilter = document.getElementById('categoriesFilter');
    if (!categoriesFilter || !window.productManager) return;
    
    const categories = window.productManager.getCategories();
    
    categoriesFilter.innerHTML = categories.map(category => `
      <div class="filter-category ${this.filters.category === category.id ? 'filter-category--active' : ''}" 
           data-category="${category.id}">
        <span class="filter-category__icon">${category.icon}</span>
        <span class="filter-category__name">${category.name}</span>
        <span class="filter-category__count">(${category.count})</span>
      </div>
    `).join('');
    
    // Ajouter les événements
    categoriesFilter.querySelectorAll('.filter-category').forEach(element => {
      element.addEventListener('click', () => {
        const categoryId = element.dataset.category;
        this.filters.category = this.filters.category === categoryId ? null : categoryId;
        this.applyFilters();
        
        // Mettre à jour l'apparence
        categoriesFilter.querySelectorAll('.filter-category').forEach(el => {
          el.classList.remove('filter-category--active');
        });
        if (this.filters.category) {
          element.classList.add('filter-category--active');
        }
      });
    });
  }

  // Initialiser les événements
  initEvents() {
    // Bouton effacer les filtres
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
      clearFilters.addEventListener('click', () => this.clearAllFilters());
    }
    
    // Filtres de prix
    const applyPriceFilter = document.getElementById('applyPriceFilter');
    if (applyPriceFilter) {
      applyPriceFilter.addEventListener('click', () => {
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        
        this.filters.minPrice = minPrice ? parseFloat(minPrice) : null;
        this.filters.maxPrice = maxPrice ? parseFloat(maxPrice) : null;
        
        this.applyFilters();
      });
    }
    
    // Cases à cocher
    const filterOnSale = document.getElementById('filterOnSale');
    if (filterOnSale) {
      filterOnSale.addEventListener('change', (e) => {
        this.filters.onSale = e.target.checked;
        this.applyFilters();
      });
    }
    
    const filterNew = document.getElementById('filterNew');
    if (filterNew) {
      filterNew.addEventListener('change', (e) => {
        this.filters.new = e.target.checked;
        this.applyFilters();
      });
    }
    
    const filterInStock = document.getElementById('filterInStock');
    if (filterInStock) {
      filterInStock.addEventListener('change', (e) => {
        this.filters.inStock = e.target.checked;
        this.applyFilters();
      });
    }
    
    // Filtre de notation
    const ratingOptions = document.querySelectorAll('.rating-filter__option');
    ratingOptions.forEach(option => {
      option.addEventListener('click', () => {
        const rating = parseFloat(option.dataset.rating);
        
        // Toggle le filtre
        if (this.filters.minRating === rating) {
          this.filters.minRating = null;
          option.classList.remove('rating-filter__option--active');
        } else {
          this.filters.minRating = rating;
          ratingOptions.forEach(opt => opt.classList.remove('rating-filter__option--active'));
          option.classList.add('rating-filter__option--active');
        }
        
        this.applyFilters();
      });
    });
    
    // Tri
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.filters.sort = e.target.value || null;
        this.applyFilters();
      });
    }
    
    // Toggle des filtres sur mobile
    const filterToggle = document.getElementById('filterToggle');
    const sidebar = document.querySelector('.products-page__sidebar');
    if (filterToggle && sidebar) {
      filterToggle.addEventListener('click', () => {
        sidebar.classList.toggle('products-page__sidebar--open');
      });
    }
  }

  // Appliquer les filtres
  applyFilters() {
    if (!window.productManager) return;
    
    // Obtenir les produits filtrés
    this.filteredProducts = window.productManager.filterProducts({
      ...this.filters,
      minRating: this.filters.minRating // Ajouter le filtre de notation
    });
    
    // Filtrer par stock si nécessaire
    if (this.filters.inStock) {
      this.filteredProducts = this.filteredProducts.filter(product => product.stock > 0);
    }
    
    // Filtrer par notation minimale
    if (this.filters.minRating) {
      this.filteredProducts = this.filteredProducts.filter(product => product.rating >= this.filters.minRating);
    }
    
    // Réinitialiser à la première page
    this.currentPage = 1;
    
    // Mettre à jour l'URL
    this.updateUrl();
    
    // Mettre à jour l'affichage
    this.updateDisplay();
  }

  // Effacer tous les filtres
  clearAllFilters() {
    // Réinitialiser les filtres
    this.filters = {
      category: null,
      minPrice: null,
      maxPrice: null,
      onSale: false,
      new: false,
      inStock: true,
      minRating: null,
      search: null,
      sort: null
    };
    
    // Réinitialiser les éléments de l'interface
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('filterOnSale').checked = false;
    document.getElementById('filterNew').checked = false;
    document.getElementById('filterInStock').checked = true;
    document.getElementById('sortSelect').value = '';
    
    // Réinitialiser les catégories
    document.querySelectorAll('.filter-category').forEach(el => {
      el.classList.remove('filter-category--active');
    });
    
    // Réinitialiser les notes
    document.querySelectorAll('.rating-filter__option').forEach(el => {
      el.classList.remove('rating-filter__option--active');
    });
    
    // Appliquer les filtres
    this.applyFilters();
  }

  // Mettre à jour l'URL
  updateUrl() {
    const params = {};
    
    if (this.filters.category) params.category = this.filters.category;
    if (this.filters.search) params.search = this.filters.search;
    if (this.filters.onSale) params.promo = 'true';
    if (this.filters.sort) params.sort = this.filters.sort;
    
    window.utils.updateUrl(params);
  }

  // Mettre à jour l'affichage
  updateDisplay() {
    this.updatePageTitle();
    this.updateProductCount();
    this.updateActiveFilters();
    this.displayProducts();
    this.displayPagination();
  }

  // Mettre à jour le titre de la page
  updatePageTitle() {
    const pageTitle = document.getElementById('pageTitle');
    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    
    let title = 'Tous les produits';
    
    if (this.filters.search) {
      title = `Résultats pour "${this.filters.search}"`;
    } else if (this.filters.category && window.productManager) {
      const category = window.productManager.getCategories().find(c => c.id === this.filters.category);
      if (category) {
        title = category.name;
      }
    } else if (this.filters.onSale) {
      title = 'Promotions';
    } else if (this.filters.new) {
      title = 'Nouveautés';
    }
    
    if (pageTitle) pageTitle.textContent = title;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = title;
  }

  // Mettre à jour le nombre de produits
  updateProductCount() {
    const productCount = document.getElementById('productCount');
    if (productCount) {
      productCount.textContent = this.filteredProducts.length;
    }
  }

  // Mettre à jour les filtres actifs
  updateActiveFilters() {
    const activeFilters = document.getElementById('activeFilters');
    const activeFiltersList = document.getElementById('activeFiltersList');
    
    if (!activeFilters || !activeFiltersList) return;
    
    const filters = [];
    
    // Catégorie
    if (this.filters.category && window.productManager) {
      const category = window.productManager.getCategories().find(c => c.id === this.filters.category);
      if (category) {
        filters.push({
          label: 'Catégorie',
          value: category.name,
          key: 'category'
        });
      }
    }
    
    // Prix
    if (this.filters.minPrice || this.filters.maxPrice) {
      let priceText = '';
      if (this.filters.minPrice && this.filters.maxPrice) {
        priceText = `${window.utils.formatPrice(this.filters.minPrice)} - ${window.utils.formatPrice(this.filters.maxPrice)}`;
      } else if (this.filters.minPrice) {
        priceText = `Plus de ${window.utils.formatPrice(this.filters.minPrice)}`;
      } else {
        priceText = `Moins de ${window.utils.formatPrice(this.filters.maxPrice)}`;
      }
      
      filters.push({
        label: 'Prix',
        value: priceText,
        key: 'price'
      });
    }
    
    // Promotions
    if (this.filters.onSale) {
      filters.push({
        label: 'En promotion',
        value: '',
        key: 'onSale'
      });
    }
    
    // Nouveautés
    if (this.filters.new) {
      filters.push({
        label: 'Nouveautés',
        value: '',
        key: 'new'
      });
    }
    
    // Note minimale
    if (this.filters.minRating) {
      filters.push({
        label: 'Note minimale',
        value: `${this.filters.minRating}★ et plus`,
        key: 'minRating'
      });
    }
    
    // Afficher ou masquer la section
    if (filters.length > 0) {
      activeFilters.style.display = 'block';
      activeFiltersList.innerHTML = filters.map(filter => `
        <div class="active-filter">
          <span class="active-filter__label">${filter.label}${filter.value ? ':' : ''}</span>
          ${filter.value ? `<span class="active-filter__value">${filter.value}</span>` : ''}
          <button class="active-filter__remove" data-filter="${filter.key}" title="Retirer ce filtre">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `).join('');
      
      // Ajouter les événements de suppression
      activeFiltersList.querySelectorAll('.active-filter__remove').forEach(btn => {
        btn.addEventListener('click', () => {
          this.removeFilter(btn.dataset.filter);
        });
      });
    } else {
      activeFilters.style.display = 'none';
    }
  }

  // Supprimer un filtre
  removeFilter(filterKey) {
    switch (filterKey) {
      case 'category':
        this.filters.category = null;
        document.querySelectorAll('.filter-category').forEach(el => {
          el.classList.remove('filter-category--active');
        });
        break;
      case 'price':
        this.filters.minPrice = null;
        this.filters.maxPrice = null;
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        break;
      case 'onSale':
        this.filters.onSale = false;
        document.getElementById('filterOnSale').checked = false;
        break;
      case 'new':
        this.filters.new = false;
        document.getElementById('filterNew').checked = false;
        break;
      case 'minRating':
        this.filters.minRating = null;
        document.querySelectorAll('.rating-filter__option').forEach(el => {
          el.classList.remove('rating-filter__option--active');
        });
        break;
    }
    
    this.applyFilters();
  }

  // Afficher les produits
  displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid || !window.productManager) return;
    
    // Calculer les produits à afficher
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    const productsToDisplay = this.filteredProducts.slice(startIndex, endIndex);
    
    // Afficher les produits
    window.productManager.displayProducts(productsToDisplay, 'productsGrid');
  }

  // Afficher la pagination
  displayPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }
    
    let paginationHTML = '';
    
    // Bouton précédent
    paginationHTML += `
      <button class="pagination__item ${this.currentPage === 1 ? 'pagination__item--disabled' : ''}" 
              data-page="${this.currentPage - 1}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    `;
    
    // Numéros de page
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      paginationHTML += `
        <button class="pagination__item" data-page="1">1</button>
        ${startPage > 2 ? '<span class="pagination__ellipsis">...</span>' : ''}
      `;
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination__item ${i === this.currentPage ? 'pagination__item--active' : ''}" 
                data-page="${i}">${i}</button>
      `;
    }
    
    if (endPage < totalPages) {
      paginationHTML += `
        ${endPage < totalPages - 1 ? '<span class="pagination__ellipsis">...</span>' : ''}
        <button class="pagination__item" data-page="${totalPages}">${totalPages}</button>
      `;
    }
    
    // Bouton suivant
    paginationHTML += `
      <button class="pagination__item ${this.currentPage === totalPages ? 'pagination__item--disabled' : ''}" 
              data-page="${this.currentPage + 1}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;
    
    pagination.innerHTML = paginationHTML;
    
    // Ajouter les événements
    pagination.querySelectorAll('.pagination__item:not(.pagination__item--disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentPage = parseInt(btn.dataset.page);
        this.displayProducts();
        this.displayPagination();
        
        // Scroll vers le haut
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
  }
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.products-page')) {
    new ProductsPage();
  }
});