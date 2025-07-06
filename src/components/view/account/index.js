import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountDetails from './accountDetails';
import Orders from './orders';
import Addresses from './addresses';
import styles from './style.module.scss';
import { useAuth } from '../../services/AuthContext.js'; // adjust path as needed
import {routes,Axios} from '../../config'
import LoadingSpinner from '../../loading/LoadingSpinner';

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: contextUser } = useAuth();

  const [activeTab, setActiveTab] = useState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateInfo,setUpdateInfo]=useState(false);
  // Tab change effect based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/orders')) {
      setActiveTab('orders');
    } else if (path.includes('/addresses')) {
      setActiveTab('addresses');
    } else {
      setActiveTab('details');
    }
  }, [location.pathname]);

  // API call to fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!contextUser?.id) return;
      setLoading(true);
      try {
        const res = await Axios.get(`${routes.getUserDetailsByid}${contextUser.id}`);
        setUser(res?.data?.data);
        console.log(res.data)
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [contextUser?.id,updateInfo]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let path = '/account';
    if (tab === 'orders') path = '/account/orders';
    if (tab === 'addresses') path = '/account/addresses';
    navigate(path);
  };

  

 if (loading) {
    return <LoadingSpinner message="Loading Account..." />;
  }
  
  if (!user) return <div className={styles.error}>User not found</div>;
  
  return (
    <div className={styles.account_page}>
      <div className={styles.container}>
        <div className={styles.account_header}>
          <h1>My Account</h1>
          <div className={styles.user_info}>
            <div className={styles.user_details}>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
              <span className={styles.member_since}>
                Member since {new Date(user?.createdAt).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.tabs_container}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => handleTabChange('details')}
            >
              Account Details
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'addresses' ? styles.active : ''}`}
              onClick={() => handleTabChange('addresses')}
            >
              My Addresses
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => handleTabChange('orders')}
            >
              My Orders
            </button>
          </div>

          <div className={styles.tab_content}>
            {activeTab === 'details' && <AccountDetails user={user} updateInfo={updateInfo} setUpdateInfo={setUpdateInfo} />}
            {activeTab === 'addresses' && <Addresses id={user.id} />}
            {activeTab === 'orders' && <Orders id={user.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

