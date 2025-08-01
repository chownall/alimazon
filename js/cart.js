// Gestion du panier - Alimazon

class Cart {
  constructor() {
    this.items = [];
    this.loadFromStorage();
    this.init();
  }

  init() {
    // Événements pour le panier
    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');

    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.toggleCart());
    }

    if (cartClose) {
      cartClose.addEventListener('click', () => this.closeCart());
    }

    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => this.closeCart());
    }

    // Mettre à jour l'affichage initial
    this.updateUI();
  }

  // Charger le panier depuis le localStorage
  loadFromStorage() {
    const savedCart = window.utils.storage.get('cart');
    if (savedCart && Array.isArray(savedCart)) {
      this.items = savedCart;
    }
  }

  // Sauvegarder le panier dans le localStorage
  saveToStorage() {
    window.utils.storage.set('cart', this.items);
  }

  // Ajouter un produit au panier
  addToCart(product, quantity = 1) {
    // Vérifier si le produit est déjà dans le panier
    const existingItem = this.items.find(item => item.id === product.id);

    if (existingItem) {
      // Augmenter la quantité
      existingItem.quantity += quantity;
      
      // Vérifier le stock
      if (existingItem.quantity > product.stock) {
        existingItem.quantity = product.stock;
        window.utils.showToast(`Stock limité : ${product.stock} unités disponibles`, 'warning');
      } else {
        window.utils.showToast('Quantité mise à jour dans le panier', 'success');
      }
    } else {
      // Ajouter le nouveau produit
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.categoryName,
        quantity: Math.min(quantity, product.stock),
        stock: product.stock
      });
      window.utils.showToast('Produit ajouté au panier', 'success');
    }

    this.saveToStorage();
    this.updateUI();
    this.openCart();
  }

  // Supprimer un produit du panier
  removeFromCart(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
    this.updateUI();
    window.utils.showToast('Produit retiré du panier', 'info');
  }

  // Mettre à jour la quantité d'un produit
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else if (quantity > item.stock) {
        item.quantity = item.stock;
        window.utils.showToast(`Stock limité : ${item.stock} unités disponibles`, 'warning');
      } else {
        item.quantity = quantity;
      }
      
      this.saveToStorage();
      this.updateUI();
    }
  }

  // Vider le panier
  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.updateUI();
    window.utils.showToast('Panier vidé', 'info');
  }

  // Calculer le total du panier
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Obtenir le nombre total d'articles
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Ouvrir le panier
  openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar) {
      cartSidebar.classList.add('cart-sidebar--open');
    }
    
    if (cartOverlay) {
      cartOverlay.classList.add('cart-overlay--active');
    }
    
    document.body.style.overflow = 'hidden';
  }

  // Fermer le panier
  closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar) {
      cartSidebar.classList.remove('cart-sidebar--open');
    }
    
    if (cartOverlay) {
      cartOverlay.classList.remove('cart-overlay--active');
    }
    
    document.body.style.overflow = '';
  }

  // Basculer l'ouverture/fermeture du panier
  toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (cartSidebar && cartSidebar.classList.contains('cart-sidebar--open')) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  // Mettre à jour l'interface utilisateur
  updateUI() {
    this.updateCartCount();
    this.updateCartContent();
    this.updateCartTotal();
  }

  // Mettre à jour le compteur du panier
  updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const count = this.getItemCount();
      cartCount.textContent = count > 99 ? '99+' : count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // Mettre à jour le contenu du panier
  updateCartContent() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    if (this.items.length === 0) {
      cartContent.innerHTML = `
        <div class="cart-sidebar__empty">
          <svg class="cart-sidebar__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
          </svg>
          <p class="cart-sidebar__empty-text">Votre panier est vide</p>
          <p>Découvrez nos produits et commencez vos achats !</p>
        </div>
      `;
      return;
    }

    const cartItems = this.items.map(item => this.createCartItemHTML(item)).join('');
    cartContent.innerHTML = cartItems;

    // Ajouter les événements pour chaque article
    this.items.forEach(item => {
      this.attachCartItemEvents(item.id);
    });
  }

  // Créer le HTML pour un article du panier
  createCartItemHTML(item) {
    return `
      <div class="cart-item" data-product-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item__image">
        <div class="cart-item__content">
          <h3 class="cart-item__title">${item.name}</h3>
          <p class="cart-item__price">${window.utils.formatPrice(item.price)}</p>
          <div class="cart-item__actions">
            <div class="cart-item__quantity">
              <button class="cart-item__quantity-btn" data-action="decrease">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="cart-item__quantity-value">${item.quantity}</span>
              <button class="cart-item__quantity-btn" data-action="increase">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <button class="cart-item__remove" data-action="remove">Retirer</button>
          </div>
        </div>
      </div>
    `;
  }

  // Attacher les événements pour un article du panier
  attachCartItemEvents(productId) {
    const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
    if (!cartItem) return;

    const decreaseBtn = cartItem.querySelector('[data-action="decrease"]');
    const increaseBtn = cartItem.querySelector('[data-action="increase"]');
    const removeBtn = cartItem.querySelector('[data-action="remove"]');

    const item = this.items.find(item => item.id === productId);
    if (!item) return;

    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        this.updateQuantity(productId, item.quantity - 1);
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        this.updateQuantity(productId, item.quantity + 1);
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.removeFromCart(productId);
      });
    }
  }

  // Mettre à jour le total du panier
  updateCartTotal() {
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
      cartTotal.textContent = window.utils.formatPrice(this.getTotal());
    }
  }

  // Obtenir les données du panier pour la commande
  getCartData() {
    return {
      items: this.items,
      total: this.getTotal(),
      itemCount: this.getItemCount()
    };
  }
}

// Initialiser le panier
window.cart = new Cart();