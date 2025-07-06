import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.scss';
import { Axios, routes } from '../config';
import { Link } from 'react-router-dom';

const SearchComponent = ({ className, isMobile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const overlayRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
        setProducts([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

const searchProduct=()=>{
 if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.length > 3) {
      debounceTimer.current = setTimeout(() => {
        setLoading(true);
        Axios.get(`${routes.search}?q=${encodeURIComponent(searchQuery)}`)
          .then((res) => {
            setProducts(res.data.data);
            setIsExpanded(true);
          })
          .catch((err) => {
            console.error(err);
            setProducts([]);
          })
          .finally(() => setLoading(false));
      }, 500);
    } else {
      setProducts([]);
      // Don't collapse here to prevent mobile collapse bug
    }
}

  // Debounced search
  useEffect(() => {
    searchProduct()
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
   if(e) e.preventDefault();
    if (searchQuery.length > 3) {
      setIsExpanded(true); // Make sure results open on submit too
    }
  };

  const toggleSearch = () => {
    setIsExpanded((prev) => !prev);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setProducts([]);
    setIsExpanded(false);
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <>
      <div
        ref={searchRef}
        className={`${styles.search_component} ${className} ${isExpanded ? styles.expanded : ''}`}
      >
        {isMobile && !isExpanded ? (
          <button
            className={styles.search_toggle}
            onClick={toggleSearch}
            aria-label="Open search"
          >
            {/* Search Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85z" />
            </svg>
          </button>
        ) : (
          <form
            className={styles.search_form}
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.search_input}
              placeholder="Search for products..."
              autoFocus={isMobile}
              aria-label="Search products"
            />

            {/* Search Button */}
            <button
              type="submit"
              className={styles.search_button}
              aria-label="Search"
              onClick={searchProduct}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85z" />
              </svg>
            </button>

            {/* Clear Button (shows if there is input) */}
            {searchQuery && (
              <button
                type="button"
                className={styles.clear_button}
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            )}

            {isMobile && (
              <button
                type="button"
                className={styles.close_button}
                onClick={toggleSearch}
                aria-label="Close search"
              >
                {/* Close Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            )}
          </form>
        )}
      </div>

      {/* Overlay */}
      {isExpanded && products.length > 0 && (
        <div ref={overlayRef} className={styles.search_overlay}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className={styles.search_results}>
              {products.map((product) => {
                const name = product.name.length > 40
                  ? product.name.slice(0, 37) + '...'
                  : product.name;
                const displayPrice = Math.floor(product.netPrice);

                return (
                  <li key={product.id} className={styles.search_result_item}>
                    <Link onClick={clearSearch} to={`/product/${product.slug}`} className={styles.result_link}>
                      <img
                        src={product.imgUrl}
                        alt={product.name}
                        className={styles.product_img}
                        loading="lazy"
                      />
                      <div className={styles.product_info}>
                        <div className={styles.product_name}>{name}</div>
                        <div className={styles.product_price}>{formatPrice(displayPrice)}</div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default SearchComponent;

