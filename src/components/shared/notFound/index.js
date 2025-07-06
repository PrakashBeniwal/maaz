import { FaExclamationTriangle } from 'react-icons/fa';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';

const ProductNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.not_found}>
      <FaExclamationTriangle className="icon" />
      <div className="message">Product Not Found</div>
      <div className="subtext">We couldn’t find the product you’re looking for.</div>
      <button className="btn" onClick={() => navigate('/')}>
        Go Back Home
      </button>
    </div>
  );
};

export default ProductNotFound;

