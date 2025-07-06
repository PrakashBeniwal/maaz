import { useState } from 'react';
import Sidebar from '../sidebar';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';
const Header = () => {
  const [hide, setHide] = useState(false);

  const onHide=()=>{
    setHide((prev)=>(!prev));
  }

  return (
    <div className={styles.Header}>
        <div className={`${styles.sidebar} ${hide&&styles.hide}`}>
          <Sidebar/>
        </div>
        <div className={styles.left}>
        <h3>SYNCX Panel</h3>
            <Link to={'/'} className="link" >Home</Link>
        </div>

  
        
        <div className={styles.right} onClick={onHide}>
            <li></li>
            <li></li>
            <li></li>
        </div>
    </div>
  )
}

export default Header
