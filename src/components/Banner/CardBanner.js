import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Banner.module.scss';

const CardBanner = ({
  cards,
  customStyles = {}
}) => {
  return (
    <div className={styles.cardBanner} style={customStyles}>
      {cards.map((card) => (
        <Link to={card.link} key={card.id} className={styles.card}>
          <div className={styles.cardImage}>
            <picture>
              <source media="(max-width: 767px)" srcSet={card.imgMobile} />
              <source media="(max-width: 1024px)" srcSet={card.imgTablet} />
              <img src={card.imgDesktop} alt={card.altText} />
            </picture>
            <div className={styles.cardOverlay}></div>
          </div>
          <div className={styles.cardContent}>
            {/* <h3>{card.title}</h3> */}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CardBanner;

