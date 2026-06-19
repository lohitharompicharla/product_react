import React, { useEffect, useMemo, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://fakestoreapi.com/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load products');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Network error'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    if (!products.length) return ['all'];
    return ['all', ...Array.from(new Set(products.map((product) => product.category)))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Amazing Products</h1>
          <p className="intro">
            Browse a curated selection of product cards powered by a fake store API. Search, filter,
            and discover stylish items for your next app demo.
          </p>
        </div>

        <div className="toolbar">
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </header>

      <section className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category === 'all' ? 'All Products' : category}
          </button>
        ))}
      </section>

      {loading ? (
        <div className="loading">Loading amazing products...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="message">No products match your search.</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-top">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-body">
                <p className="product-category">{product.category}</p>
                <h2 className="product-title">{product.title}</h2>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="price">${product.price.toFixed(2)}</span>
                  <span className="rating">? {product.rating?.rate ?? '0.0'}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
