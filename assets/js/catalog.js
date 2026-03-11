class Catalog {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.filters = {
      category: [],
      karat: [],
      priceRange: [0, 1000000], // Min, Max
      search: ''
    };
    this.sort = 'default';
    this.page = 1;
    this.itemsPerPage = 12;
    
    this.init();
  }

  async init() {
    try {
      if (window.catalogData) {
        this.products = window.catalogData;
      } else {
        const response = await fetch('./data/catalog.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.products = await response.json();
      }
      this.filteredProducts = [...this.products];
      this.renderFilters();
      this.applyFilters();
    } catch (error) {
      console.error('Failed to load catalog:', error);
      const container = document.getElementById('product-grid');
      if (container) {
        container.innerHTML = `<p class="error-message">Sorry, we couldn't load the products. Please try again later.<br><small>${error.message}</small></p>`;
      }
    }
  }

  renderFilters() {
    // Generate filter options dynamically based on data
    const categories = [...new Set(this.products.map(p => p.category))];
    const karats = [...new Set(this.products.map(p => p.karat))];
    
    this.renderCheckboxFilter('category-filters', categories, 'category');
    this.renderCheckboxFilter('karat-filters', karats, 'karat');
    
    // Listeners
    document.getElementById('search-input').addEventListener('input', (e) => {
      this.filters.search = e.target.value.toLowerCase();
      this.page = 1;
      this.applyFilters();
    });

    document.getElementById('sort-select').addEventListener('change', (e) => {
      this.sort = e.target.value;
      this.applyFilters();
    });
  }

  renderCheckboxFilter(elementId, options, type) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    container.innerHTML = options.map(opt => `
      <label class="filter-option">
        <input type="checkbox" value="${opt}" data-type="${type}"> ${opt}
      </label>
    `).join('');

    container.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        const val = input.value;
        const checked = input.checked;
        if (checked) {
          this.filters[type].push(val);
        } else {
          this.filters[type] = this.filters[type].filter(item => item !== val);
        }
        this.page = 1;
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchCategory = this.filters.category.length === 0 || this.filters.category.includes(p.category);
      const matchKarat = this.filters.karat.length === 0 || this.filters.karat.includes(p.karat);
      const matchSearch = p.name.toLowerCase().includes(this.filters.search) || 
                          (p.name_si && p.name_si.includes(this.filters.search)) ||
                          (p.name_ta && p.name_ta.includes(this.filters.search));
      
      return matchCategory && matchKarat && matchSearch;
    });

    this.sortProducts();
    this.renderProducts();
    this.renderPagination();
  }

  sortProducts() {
    if (this.sort === 'price-asc') {
      this.filteredProducts.sort((a, b) => a.price_lkr - b.price_lkr);
    } else if (this.sort === 'price-desc') {
      this.filteredProducts.sort((a, b) => b.price_lkr - a.price_lkr);
    } else if (this.sort === 'name-asc') {
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  renderProducts() {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageProducts = this.filteredProducts.slice(start, end);
    
    const container = document.getElementById('product-grid');
    if (!container) return;

    if (pageProducts.length === 0) {
      container.innerHTML = '<p class="text-center">No products found.</p>';
      return;
    }

    container.innerHTML = pageProducts.map((p, index) => `
      <div class="product-card" style="animation-delay: ${index * 0.1}s">
        <a href="product.html?id=${p.id}" class="product-image-container">
          <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
        </a>
        <div class="product-info">
          <h3 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <p class="product-price">${formatCurrency(p.price_lkr)}</p>
          <div class="product-meta">
            <span class="tag">${p.karat}</span>
            <span>${p.weight_g}g</span>
            <button class="wishlist-btn" data-id="${p.id}" onclick="Wishlist.toggle('${p.id}')">
              ${Wishlist.has(p.id) ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
    // Re-bind wishlist buttons (if needed, though onclick works)
  }

  renderPagination() {
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const container = document.getElementById('pagination');
    if (!container) return;

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination-btn ${i === this.page ? 'active' : ''}" onclick="catalog.goToPage(${i})">${i}</button>`;
    }
    container.innerHTML = html;
  }

  goToPage(page) {
    this.page = page;
    this.renderProducts();
    this.renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const catalog = new Catalog();
