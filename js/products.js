// Gestion des produits - Alimazon

class ProductManager {
  constructor() {
    this.products = [];
    this.categories = [];
    this.loadProducts();
  }

  // Charger les produits depuis le fichier JSON
  async loadProducts() {
    try {
      const data = await window.utils.fetchData('/data/products.json');
      this.products = data.products || [];
      this.categories = data.categories || [];
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      this.products = [];
      this.categories = [];
    }
  }

  // Obtenir tous les produits
  getAllProducts() {
    return this.products;
  }

  // Obtenir un produit par ID
  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id));
  }

  // Obtenir les produits par catégorie
  getProductsByCategory(category) {
    return this.products.filter(product => product.category === category);
  }

  // Obtenir les produits en vedette
  getFeaturedProducts() {
    return this.products.filter(product => product.featured);
  }

  // Obtenir les nouveaux produits
  getNewProducts() {
    return this.products.filter(product => product.new);
  }

  // Obtenir les produits en promotion
  getProductsOnSale() {
    return this.products.filter(product => product.onSale);
  }

  // Filtrer les produits
  filterProducts(filters = {}) {
    let filteredProducts = [...this.products];

    // Filtre par catégorie
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }

    // Filtre par prix
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice);
    }

    // Filtre par recherche
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.categoryName.toLowerCase().includes(searchTerm)
      );
    }

    // Filtre par promotion
    if (filters.onSale) {
      filteredProducts = filteredProducts.filter(product => product.onSale);
    }

    // Filtre par nouveauté
    if (filters.new) {
      filteredProducts = filteredProducts.filter(product => product.new);
    }

    // Tri
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => b.new - a.new);
          break;
      }
    }

    return filteredProducts;
  }

  // Créer le HTML pour une carte produit
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discount = product.originalPrice ? 
      Math.round((1 - product.price / product.originalPrice) * 100) : 0;

    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-card__link">
        <div class="product-card__image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
          ${product.onSale && discount > 0 ? `<span class="badge badge--error product-card__badge">-${discount}%</span>` : ''}
          ${product.new && !product.onSale ? '<span class="badge badge--secondary product-card__badge">Nouveau</span>' : ''}
        </div>
        <div class="product-card__content">
          <p class="product-card__category">${product.categoryName}</p>
          <h3 class="product-card__title">${product.name}</h3>
          <div class="product-card__rating">
            <div class="product-card__stars">
              ${window.utils.generateStars(product.rating)}
            </div>
            <span class="product-card__rating-count">(${product.reviews})</span>
          </div>
          <div class="product-card__footer">
            <div class="product-card__price">
              <span class="product-card__price-current">${window.utils.formatPrice(product.price)}</span>
              ${product.originalPrice ? `<span class="product-card__price-original">${window.utils.formatPrice(product.originalPrice)}</span>` : ''}
            </div>
            <button class="product-card__add-to-cart" data-product-id="${product.id}" title="Ajouter au panier">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
              </svg>
            </button>
          </div>
        </div>
      </a>
    `;

    // Ajouter l'événement pour le bouton d'ajout au panier
    const addToCartBtn = card.querySelector('.product-card__add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (product.stock === 0) {
          window.utils.showToast('Produit en rupture de stock', 'error');
          return;
        }
        
        window.cart.addToCart(product);
      });
    }

    return card;
  }

  // Afficher les produits dans un conteneur
  displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Vider le conteneur
    container.innerHTML = '';

    if (products.length === 0) {
      container.innerHTML = `
        <div class="products__empty">
          <p>Aucun produit trouvé</p>
        </div>
      `;
      return;
    }

    // Créer et ajouter les cartes produits
    products.forEach(product => {
      const card = this.createProductCard(product);
      container.appendChild(card);
    });
  }

  // Afficher les produits en vedette
  async displayFeaturedProducts(containerId = 'featuredProducts') {
    await this.loadProducts();
    const featuredProducts = this.getFeaturedProducts().slice(0, 4);
    this.displayProducts(featuredProducts, containerId);
  }

  // Afficher les nouveaux produits
  async displayNewProducts(containerId = 'newProducts') {
    await this.loadProducts();
    const newProducts = this.getNewProducts().slice(0, 4);
    this.displayProducts(newProducts, containerId);
  }

  // Afficher les produits en promotion
  async displaySaleProducts(containerId = 'saleProducts') {
    await this.loadProducts();
    const saleProducts = this.getProductsOnSale().slice(0, 4);
    this.displayProducts(saleProducts, containerId);
  }

  // Obtenir toutes les catégories
  getCategories() {
    return this.categories;
  }

  // Rechercher des produits
  searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.categoryName.toLowerCase().includes(searchTerm)
    );
  }
}

// Initialiser le gestionnaire de produits
window.productManager = new ProductManager();