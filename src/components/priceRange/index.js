import React, { useState, useEffect } from 'react';
import styles from './index.module.scss'; // Or use Tailwind if preferred

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const [minVal, setMinVal] = useState(Number(value[0]) || 0);
  const [maxVal, setMaxVal] = useState(Number(value[1])!=null?Number(value[1]):max);

  useEffect(() => {
    setMinVal(Number(value[0]) != null ? Number(value[0]) : min);
    setMaxVal(Number(value[1]) != null ? Number(value[1]) : max);
  }, [value, min, max]);
  
  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(val);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(val);
  };

  return (
    <div className={styles.rangeWrapper}>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className={`${styles.thumb} ${styles.thumbLeft}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className={`${styles.thumb} ${styles.thumbRight}`}
        />

        <div className={styles.slider}>
          <div className={styles.sliderTrack}></div>
          <div
            className={styles.sliderRange}
            style={{
              left: `${((minVal - min) / (max - min)) * 100}%`,
              right: `${100 - ((maxVal - min) / (max - min)) * 100}%`
            }}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.priceValues}>
          <span>Rs {minVal.toLocaleString()}</span>
          <span>Rs {maxVal.toLocaleString()}</span>
        </div>
        <button className={styles.filterButton} onClick={() => onChange(minVal, maxVal)}>
          Filter
        </button>
      </div>
    </div>
  );
};

export default PriceRangeSlider;

