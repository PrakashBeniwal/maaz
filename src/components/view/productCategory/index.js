import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import ProductCart from '../../productCart';
import styles from './style.module.scss';
import SuccessPopup from '../../shared/SuccessPopup';
import Loader from '../../loading/LoadingSpinner.js';
import { Axios, routes } from '../../config/index.js';
import { error } from '../../services/error';
import PriceRangeSlider from '../../priceRange';
import ProductNotFound from '../../shared/notFound/index.js'
import { useRef } from 'react';

const ProductCategory = ({categoryName}) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [childCategoryData, setChildCategoryData] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const [availableBrands, setAvailableBrands] = useState([]);
  const [priceLimits, setPriceLimits] = useState(0);
  const [priceRange, setPriceRange] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [childList,setChildList]=useState([]);
  const { childCategory,cat,sub } = useParams();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const brands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const minPrice = searchParams.get('minPrice') || null;
  const maxPrice = searchParams.get('maxPrice') || null;
  const onSale = searchParams.get('onSale') === 'true';
  const orderBy = searchParams.get('orderBy') || 'latest';
  

const filterRef = useRef();

useEffect(() => {
  const handleClickOutside = (event) => {
    if (showFilters && filterRef.current && !filterRef.current.contains(event.target)) {
      setShowFilters(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showFilters]);

  const selectedFilters = {
    brands,
    priceRange: [Number(minPrice) || 0, Number(maxPrice) || 0],
    onSale
  };

const updateSearchParams = (newParams) => {
  const updated = new URLSearchParams();

  // Copy existing params except ones being updated
  searchParams.forEach((value, key) => {
    if (!Object.keys(newParams).includes(key)) {
      updated.append(key, value);
    }
  });

  // Add or update new params
  Object.entries(newParams).forEach(([key, value]) => {
    updated.delete(key); // Clean existing

    if (Array.isArray(value)) {
      const filtered = value.filter(v => v !== '' && v !== null && v !== undefined);
      if (filtered.length) {
        updated.set(key, filtered.join(',')); // ✅ comma-separated for arrays
      }
    } else if (value !== '' && value !== null && value !== undefined) {
      updated.set(key, value); // ✅ single value
    }
  });

  updated.set('page', 1); // reset page
  setSearchParams(updated);
};




    const handlePriceChange = (min,max) => {
    updateSearchParams({
  minPrice:min,
  maxPrice:max
});

  };


 const handleFilterChange = (category, value) => {
  const updated = new URLSearchParams(searchParams);

  if (category === 'onSale') {
    if (onSale) {
      updated.delete('onSale');
    } else {
      updated.set('onSale', 'true');
    }
  } else if (category === 'brand') {
    // Use a Set to toggle the brand value
    const currentBrands = new Set(
      (updated.get('brand') || '').split(',').filter(Boolean)
    );

    if (currentBrands.has(value)) {
      currentBrands.delete(value);
    } else {
      currentBrands.add(value);
    }

    // Update the brand query param as comma-separated string
    if (currentBrands.size > 0) {
      updated.set('brand', Array.from(currentBrands).join(','));
    } else {
      updated.delete('brand');
    }
  }

  updated.set('page', 1);
  setSearchParams(updated);
};

  const handleSortChange = (e) => {
    updateSearchParams({ orderBy: e.target.value });
  };

  const handlePageChange = (newPage) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', newPage);
    setSearchParams(updated);
  };

  const handleAddToCart = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch(addToCart({ ...product, quantity }));
    setAddedProduct(product);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setAddedProduct(null);
  };

  const getList = () => {
    setLoading(true);

    const query = new URLSearchParams();
    if (page > 1) query.set('page', page);
    query.set('limit', 21);
    
    if (brands.length > 0) {
  query.set('brand', brands.join(','));
}

    if (minPrice) query.set('minPrice', minPrice);
    if (maxPrice) query.set('maxPrice', maxPrice);
    if (onSale) query.set('onSale', true);
    if (orderBy) query.set('orderBy', orderBy);

    const baseURL = routes.getProductsByChildCategorySlug;
    const separator = baseURL.includes('?') ? '&' : '?';

    Axios.get(`${baseURL}${childCategory}${separator}${query.toString()}`)
      .then((res) => {
        setProducts(res.data.products);
        setCategory(res.data.category);
        setSubCategory(res.data.subCategory);
        setChildCategoryData(res.data.childCategory);
        setTotalPages(res.data.totalPages);
        setChildList(res?.data?.childList)
        setAvailableBrands(res.data?.brands || []);

        if(minPrice || maxPrice){
            if(maxPrice){
        setPriceLimits(maxPrice);
         if(minPrice){
        setPriceRange([minPrice, maxPrice]);
            }else{
        setPriceRange([0, maxPrice]);
            }
            
            }
          }else if(res.data?.page==1){
        setPriceLimits(res.data?.maxPrice || 0);
        setPriceRange([0, res.data?.maxPrice]);
        }
      })
      .catch(err => error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getList();
    window.scrollTo(0, 0);
  }, [searchParams, childCategory]);

 useEffect(() => {
  if (priceLimits) {
    setPriceRange([0, priceLimits]);
  }
}, [priceLimits]);



  const renderCategoryName = (cat) => {
    if (!cat) return '';
    if (typeof cat === 'string') return cat;
    if (typeof cat === 'object' && cat?.name) return cat?.name;
    return '';
  };

  if (loading) return <Loader />;

 
  return (
    <div className={styles.category_page}>
      <div className={styles.container}>
     
{showFilters && <div className={styles.overlay} />}
        <div className={styles.main_content}>
          <div className={`${styles.filter_sidebar} ${showFilters ? styles.show : ''}`}  ref={filterRef}>
            <button className={styles.close_filters} onClick={() => setShowFilters(false)}>×</button>

          <div className={styles.filter_section}>
              {availableBrands?.length>0&&<h3 className={styles.filter_title}>Brands</h3>}
              {availableBrands?.map(brand => (
                <label key={brand?.slug} className={styles.filter_option}>
                  <input
                    type="checkbox"
                    checked={brands.includes(brand?.slug)}
                    onChange={() => handleFilterChange('brand', brand?.slug)}
                    
                  />
                  <span>{brand?.name}</span>
                </label>
              ))}
            </div>

           <div className={styles.filter_section}>
              <h3 className={styles.filter_title}>Price Range</h3>
              <div className={styles.price_range_slider}>
                <PriceRangeSlider
                  min={minPrice}
                  max={priceLimits}
                  value={priceRange}
                  onChange={handlePriceChange}
                />
          
              </div>
            </div>
              

            <div className={styles.filter_section}>
              <h3 className={styles.filter_title}>Special Offers</h3>
              <label className={styles.filter_option}>
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={() => handleFilterChange('onSale')}
                />
                <span>On Sale</span>
              </label>
            </div>

            <div> 
             <span>
 <span 
  className={styles.subcategory_name}
  > {subCategory}</span>
</span>

            {childList && childList.length > 0 && (
  <>
    <span 
      className={`${styles.sub_arrow} ${false? styles.expanded : ''}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
      </svg>
    </span>

    {(
      <ul className={styles.child_categories}>
        {childList.map((childCat, childIdx) => (
          <li key={childIdx}>
            <Link
              to={`/category/${cat}/${sub}/${childCat?.slug}`}
            >
              {childCat.name}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </>
)}

          
                    </div>
                    
          </div>

          <div className={styles.products_section}>
            <div className={styles.filter_bar}>
              <div className={styles.breadcrumb}>
                <Link to="/">Home</Link>
                <span className={styles.separator}>/</span>
                <span>{renderCategoryName(category)}</span>
                <span className={styles.separator}>/</span>
                <Link to={`/category/${cat}/${sub}`}>{renderCategoryName(subCategory)}</Link>
                <span className={styles.separator}>/</span>
                <span>{renderCategoryName(childCategoryData)}</span>
              </div>

              <button className={styles.mobile_filter_toggle} onClick={() => setShowFilters(!showFilters)}>
                Filters
              </button>

              <select className={styles.sort_dropdown} value={orderBy} onChange={handleSortChange}>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="createdAtAsc">Oldest First</option>
                <option value="createdAtDesc">Newest First</option>
              </select>
            </div>

            {Object.values(selectedFilters).some(
              filters => Array.isArray(filters) ? filters.length > 0 : filters === true
            ) && (
              <div className={styles.active_filters}>
                {brands.map(brand => (
                  <span key={brand} className={styles.active_filter}>
                    {brand}
                    <button onClick={() => handleFilterChange('brand', brand)} className={styles.remove_filter}>×</button>
                  </span>
                ))}
                {minPrice && maxPrice && (
                  <span className={styles.active_filter}>
                    ₹{minPrice} - ₹{maxPrice}
                    <button onClick={() => updateSearchParams({ minPrice: '', maxPrice: '' })} className={styles.remove_filter}>×</button>
                  </span>
                )}
                {onSale && (
                  <span className={styles.active_filter}>
                    On Sale
                    <button onClick={() => handleFilterChange('onSale')} className={styles.remove_filter}>×</button>
                  </span>
                )}
                <button
                  className={styles.clear_filters}
                  onClick={() =>
                    setSearchParams({ })
                  }
                >
                  Clear All
                </button>
              </div>
            )}

    {!products||products?.length<1?<ProductNotFound/>: <ProductCart products={products} onAddToCart={handleAddToCart} />}
           

            <div className={styles.pagination}>
              <button
                className={`${styles.pagination_button} ${styles.prev} ${page === 1 ? styles.disabled : ''}`}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`${styles.pagination_button} ${page === p ? styles.active : ''}`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className={`${styles.pagination_button} ${styles.next} ${page === totalPages ? styles.disabled : ''}`}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <SuccessPopup
          isOpen={showPopup}
          onClose={handleClosePopup}
          message={`Added ${quantity} ${addedProduct?.name} to your basket`}
        />
      </div>
    </div>
  );
};

export default ProductCategory;

