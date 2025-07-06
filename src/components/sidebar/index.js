import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';
import {Axios,routes} from '../config/index.js'
import {error} from '../services/error'
import Loader from '../loading'
const Sidebar = ({ isVisible, onCollapse, onClose, className }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState(null)
  const [loading, setLoading] = useState(false)

    const getList = () => {
      setLoading(true);
        Axios.get(routes.Categorylist)
            .then((d) => {
                if (d.data) {
                    setCategories(d.data.data)
                    return;
                }
            }).catch(err => {
                return error(err);
            }).finally(() => {
                setLoading(false)
            })
    }


  
  // Check if the device is mobile
  useEffect(() => {
  getList()
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  

  const toggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  const toggleSubcategory = (subcategoryKey) => {
    setExpandedSubcategories({
      ...expandedSubcategories,
      [subcategoryKey]: !expandedSubcategories[subcategoryKey]
    });
  };

  const createSubcategoryKey = (category, subcategory) => {
    return `${category}-${subcategory}`;
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    
    if (onCollapse) {
      onCollapse(true);
    }
  };

  const handleClick=(e)=>{
e.stopPropagation()
    handleClose()
  }

  return (
    <>
      {/* Overlay for mobile - clicking it will close the sidebar */}
      {(
        <div 
          className={`${styles.sidebar_overlay} ${isVisible ? styles.visible : ''}`}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
      
      <aside className={`${styles.sidebar} ${isVisible ? styles.visible : ''} ${className || ''}`}>
        <div className={styles.sidebar_header}>
          <h2>Shop By Category</h2>
          <button 
            className={styles.close_button}
            onClick={handleClose}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
         
        <div className={styles.sidebar_content}>
          <div className={styles.categories}>
            {!loading?categories?.map((category, index) => (
              <div key={index} className={styles.category}>
                <div 
                  className={styles.category_header}
                  onClick={() => toggleCategory(category.name)}
                >
                  <span>{category.name}</span>
                  <span className={`${styles.arrow} ${expandedCategories[category.name] ? styles.expanded : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </span>
                </div>
                
                {expandedCategories[category.name] && (
                  <ul className={styles.subcategories}>
                    {category.subCategories.map((subcat, idx) => {
                      const subcatKey = createSubcategoryKey(category.name, subcat.name);
                      return (
                        <li key={idx} className={styles.subcategory_item}>
                          <div 
                            className={styles.subcategory_header}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSubcategory(subcatKey);
                            }}
                          >
                            <span>
 <Link  to={`/category/${category.slug.toLowerCase()}/${subcat.slug.toLowerCase().replace(/ /g, "-")}`}
  className={styles.subcategory_name}
  onClick={handleClick}> {subcat.name}</Link>
</span>
                            {subcat.childCategories && subcat.childCategories.length > 0 && (
                              <span 
                                className={`${styles.sub_arrow} ${expandedSubcategories[subcatKey] ? styles.expanded : ''}`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                </svg>
                              </span>
                            )}
                          </div>
                          
                          {subcat.childCategories && subcat.childCategories.length > 0 && expandedSubcategories[subcatKey] && (
                            <ul className={styles.child_categories}>
                              {subcat.childCategories.map((childCat, childIdx) => (
                                <li key={childIdx}>
                                  <Link onClick={handleClick} to={`/category/${category.slug.toLowerCase()}/${subcat.slug.toLowerCase().replace(/ /g, '-')}/${childCat.slug.toLowerCase().replace(/ /g, '-')}`}>
                                    {childCat.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )):<Loader/>}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 
