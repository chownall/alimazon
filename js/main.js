// Script principal - Alimazon

class App {
  constructor() {
    this.init();
  }

  init() {
    // Initialiser les fonctionnalités communes
    this.initSearch();
    this.initAccount();
    this.initLazyLoading();
    this.initToastStyles();
    this.initMobileMenu();
    this.initCategoriesDropdown();
    
    // Afficher un message de bienvenue dans la console
    console.log('%c🛒 Bienvenue sur Alimazon!', 'color: #CDDC39; font-size: 20px; font-weight: bold;');
    console.log('%cVotre destination shopping en ligne', 'color: #FF9800; font-size: 14px;');
  }

  // Initialiser la recherche globale
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

      // Focus sur le champ de recherche avec Ctrl+K ou Cmd+K
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      });
    }
  }

  // Initialiser les fonctionnalités du compte
  initAccount() {
    const accountBtn = document.getElementById('accountBtn');
    
    if (accountBtn) {
      accountBtn.addEventListener('click', () => {
        // Vérifier si l'utilisateur est connecté
        const user = window.utils.storage.get('user');
        
        if (user) {
          window.location.href = 'account.html';
        } else {
          window.location.href = 'login.html';
        }
      });
    }
  }

  // Initialiser le lazy loading des images
  initLazyLoading() {
    window.utils.lazyLoadImages();
    
    // Observer pour les nouvelles images ajoutées dynamiquement
    const observer = new MutationObserver(() => {
      window.utils.lazyLoadImages();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialiser les styles pour les toasts
  initToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: var(--z-tooltip);
        pointer-events: none;
      }
      
      .toast {
        background: var(--color-white);
        color: var(--color-gray-900);
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        margin-bottom: var(--spacing-sm);
        transform: translateX(400px);
        transition: transform var(--transition-base);
        pointer-events: auto;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }
      
      .toast--show {
        transform: translateX(0);
      }
      
      .toast--success {
        border-left: 4px solid var(--color-success);
      }
      
      .toast--error {
        border-left: 4px solid var(--color-error);
      }
      
      .toast--warning {
        border-left: 4px solid var(--color-warning);
      }
      
      .toast--info {
        border-left: 4px solid var(--color-info);
      }
      
      @media (max-width: 640px) {
        .toast-container {
          left: var(--spacing-md);
          right: var(--spacing-md);
        }
        
        .toast {
          transform: translateY(-100px);
        }
        
        .toast--show {
          transform: translateY(0);
        }
      }
      
      /* Styles pour les suggestions de recherche */
      .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--color-white);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        margin-top: var(--spacing-xs);
        max-height: 400px;
        overflow-y: auto;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all var(--transition-base);
        z-index: var(--z-dropdown);
      }
      
      .search-suggestions--visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .search-suggestion {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-sm) var(--spacing-md);
        transition: background-color var(--transition-fast);
      }
      
      .search-suggestion:hover {
        background-color: var(--color-gray-100);
      }
      
      .search-suggestion__image {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: var(--border-radius-sm);
      }
      
      .search-suggestion__content {
        flex: 1;
      }
      
      .search-suggestion__title {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-xs);
      }
      
      .search-suggestion__price {
        font-size: var(--font-size-xs);
        color: var(--color-gray-600);
      }
    `;
    document.head.appendChild(style);
  }

  // Initialiser le menu mobile
  initMobileMenu() {
    // Créer le bouton de menu mobile s'il n'existe pas
    const header = document.querySelector('.header');
    if (!header) return;

    // Vérifier si nous sommes sur mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    // Ajouter la fonctionnalité de menu mobile ici si nécessaire
  }

  // Initialiser le dropdown des catégories
  initCategoriesDropdown() {
    const categoriesLink = document.querySelector('.nav-menu__link--categories');
    if (!categoriesLink) return;

    // Créer le dropdown des catégories
    const dropdown = document.createElement('div');
    dropdown.className = 'categories-dropdown';
    
    // Charger les catégories
    if (window.productManager) {
      window.productManager.loadProducts().then(() => {
        const categories = window.productManager.getCategories();
        
        dropdown.innerHTML = categories.map(category => `
          <a href="products.html?category=${category.id}" class="categories-dropdown__item">
            <span class="categories-dropdown__icon">${category.icon}</span>
            <span class="categories-dropdown__name">${category.name}</span>
            <span class="categories-dropdown__count">(${category.count})</span>
          </a>
        `).join('');
        
        categoriesLink.appendChild(dropdown);
      });
    }

    // Gérer l'affichage du dropdown
    let dropdownTimeout;
    
    categoriesLink.addEventListener('mouseenter', () => {
      clearTimeout(dropdownTimeout);
      dropdown.style.display = 'block';
      setTimeout(() => {
        dropdown.classList.add('categories-dropdown--visible');
      }, 10);
    });

    categoriesLink.addEventListener('mouseleave', () => {
      dropdown.classList.remove('categories-dropdown--visible');
      dropdownTimeout = setTimeout(() => {
        dropdown.style.display = 'none';
      }, 300);
    });
  }

  // Obtenir les informations de l'utilisateur connecté
  getCurrentUser() {
    return window.utils.storage.get('user');
  }

  // Se déconnecter
  logout() {
    window.utils.storage.remove('user');
    window.utils.storage.remove('authToken');
    window.cart.clearCart();
    window.location.href = 'index.html';
  }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  
  // Initialiser le smooth scroll pour les ancres
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Gérer le scroll pour afficher/masquer le header
  let lastScroll = 0;
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', window.utils.throttle(() => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        header.classList.remove('header--scrolled');
        return;
      }
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scroll down
        header.classList.add('header--hidden');
      } else {
        // Scroll up
        header.classList.remove('header--hidden');
      }
      
      if (currentScroll > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      
      lastScroll = currentScroll;
    }, 100));
  }
});