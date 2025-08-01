# Alimazon - Site E-commerce

Un site e-commerce moderne et élégant développé en HTML, CSS et JavaScript vanilla, avec un design épuré et une palette de couleurs Lime-Orange distinctive.

## 🎨 Design et Style

- **Style** : Moderne et minimaliste
- **Palette de couleurs** : Lime (#CDDC39) et Orange (#FF9800)
- **Typographie** : Inter (Google Fonts)
- **Interface** : Responsive et accessible

## 🚀 Fonctionnalités Implémentées

### 1. Page d'accueil (`index.html`)
- Slider hero avec rotation automatique
- Catégories populaires avec images
- Produits en vedette
- Nouveautés
- Section promotions
- Fonctionnalités du site (livraison, paiement sécurisé, etc.)

### 2. Catalogue produits (`products.html`)
- Grille de produits responsive
- Filtres avancés :
  - Par catégorie
  - Par prix (min/max)
  - Promotions
  - Nouveautés
  - En stock uniquement
  - Note minimale
- Tri des produits (prix, nom, note, nouveautés)
- Pagination
- Compteur de produits
- Breadcrumb de navigation

### 3. Système de panier
- Ajout/suppression de produits
- Mise à jour des quantités
- Gestion du stock
- Persistance locale (localStorage)
- Sidebar panier avec overlay
- Calcul automatique du total

### 4. Fonctionnalités globales
- Recherche de produits
- Navigation responsive
- Toast notifications
- Lazy loading des images
- Raccourci clavier (Ctrl+K pour recherche)

## 📁 Structure du projet

```
alimazon/
├── index.html              # Page d'accueil
├── products.html           # Catalogue produits
├── assets/
│   └── favicon.svg        # Favicon du site
├── css/
│   ├── reset.css          # Reset CSS moderne
│   ├── variables.css      # Variables CSS (couleurs, espacements, etc.)
│   ├── global.css         # Styles globaux et composants
│   ├── header.css         # Styles du header
│   ├── footer.css         # Styles du footer
│   ├── home.css           # Styles page d'accueil
│   └── products.css       # Styles page produits
├── js/
│   ├── utils.js           # Fonctions utilitaires
│   ├── cart.js            # Gestion du panier
│   ├── products.js        # Gestion des produits
│   ├── home.js            # Fonctionnalités page d'accueil
│   ├── productsPage.js    # Fonctionnalités page produits
│   └── main.js            # Script principal
└── data/
    └── products.json      # Données des produits
```

## 🛠 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec variables CSS
- **JavaScript ES6+** : Classes, modules, async/await
- **Aucune dépendance externe** : Vanilla JS uniquement

## 🎯 Fonctionnalités techniques

- Design responsive (mobile-first)
- Performance optimisée (lazy loading)
- Accessibilité (WCAG 2.1)
- SEO-friendly
- LocalStorage pour la persistance
- Gestion d'état côté client

## 🚀 Installation et utilisation

1. Cloner le repository
2. Ouvrir `index.html` dans un navigateur moderne
3. Pour un développement local, utiliser un serveur HTTP simple :
   ```bash
   python -m http.server 8000
   # ou
   npx serve
   ```

## 📱 Compatibilité

- Chrome/Edge (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Mobile responsive

## 🔄 Prochaines étapes

Les fonctionnalités suivantes sont prévues mais non encore implémentées :

- Page de détail produit
- Processus de checkout complet
- Système d'authentification utilisateur
- Suivi des commandes
- Système de notation et avis
- Intégration API backend
- Tests unitaires

## 📄 Licence

Ce projet est un exemple de développement e-commerce et peut être utilisé librement à des fins éducatives.

---

Développé avec ❤️ en utilisant les meilleures pratiques du développement web moderne.
