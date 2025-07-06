import React, { useEffect,useState } from 'react';
import ProductScroll from '../../productScroll';
import styles from './style.module.scss';
import { CardBanner, HeroBanner } from '../../Banner';
import Loader from '../../loading/LoadingSpinner.js'
import {Axios,routes} from '../../config/index.js'
import {error} from '../../services/error'
import RecentlyViewed from '../../RecentlyViewed'

const HomePage = () => {

  const [recent,setRecent]=useState();
  const [offer,setOffer]=useState();
 
// 1. Define states
const [mainBanner, setMainBanner] = useState([]);
const [hotBanner, setHotBanner] = useState([]);
const [sideBanner, setSideBanner] = useState([]);
const [gearUpBanner, setGearUpBanner] = useState([]);
const [loading, setLoading] = useState(false);

// 2. Map names to setters
const bannerSetters = {
  'main-banner': setMainBanner,
  'hot-banner': setHotBanner,
  'side-banner': setSideBanner,
  'gear-up-banner': setGearUpBanner,
};

   const getRecent = () => {
  setLoading(true);
  Axios.get(`${routes.getRecentProducts}?limit=10`)
    .then((res) => {
      if (res.data) {
    setRecent(res.data)
      }
    })
    .catch(err => error(err))
    .finally(() => setLoading(false));
};

 const getOffer = () => {
  setLoading(true);
  Axios.get(`${routes.getDiscountedProducts}?limit=10`)
    .then((res) => {
      if (res.data) {
    setOffer(res.data)
      }
    })
    .catch(err => error(err))
    .finally(() => setLoading(false));
};

  useEffect(() => {
  getRecent()
  getOffer()
    window.scrollTo(0, 0);
  }, []);

const getBanner = (name) => {
  setLoading(true);
  Axios.get(`${routes.getBannerByPosition}${name}`)
    .then((res) => {
      if (res.data && bannerSetters[name]) {
        bannerSetters[name](res?.data?.data); // 👈 Set correct state based on name
      }
    })
    .catch(err => error(err))
    .finally(() => setLoading(false));
};


  useEffect(() => {
  getRecent()
  getOffer()
  getBanner('main-banner')
  getBanner('hot-banner')
  getBanner('side-banner')
  getBanner('gear-up-banner')
  
    window.scrollTo(0, 0);
  }, []);



  return (
    <div className={styles.home_page}>
      <div className={styles.container}>
        {/* Hero Banner at top of page */}
       {mainBanner?.length>0&& <HeroBanner
         mainSlides={mainBanner}
         sideSlides={sideBanner}
          autoSlideInterval={5000}
        />}

        {/* Fresh Picks Section */}
        <section className={styles.section}>
          {recent?<ProductScroll
            title="Fresh Picks"
            products={recent}
            viewAllLink="/products/fresh-picks"
          />:<Loader/>
          }
        </section>

        {hotBanner?.length>0&&<div>
          <h2>What Hots</h2>
          <CardBanner cards={hotBanner} />
        </div>}

        {/* Flash Deals Section */}
        <section className={styles.section}>
         {offer? <ProductScroll
            title="Flash Deals"
            products={offer}
            viewAllLink="/products/flash-deals"
            showTimer={true}
          />:<Loader/>
          }
        </section>

        {gearUpBanner?.length>0&& <div>
          <h2>Gear Up This Month</h2>
          <CardBanner cards={gearUpBanner} />
        </div>}

      <RecentlyViewed/>
      </div>
      
    </div>
  );
};

export default HomePage; 
