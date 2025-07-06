import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Banner.module.scss';

const HeroBanner = ({
  mainSlides,
  sideSlides,
  autoSlideInterval = 5000,
  customStyles = {}
}) => {
  const [activeMainSlide, setActiveMainSlide] = useState(0);
  const [activeSideSlides, setActiveSideSlides] = useState([0, 0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const mainSliderRef = useRef(null);
  const sideSliderRefs = [useRef(null), useRef(null), useRef(null)];
  const timerRef = useRef(null);
  const sideTimersRef = useRef([null, null, null]);

  useEffect(() => {
    if (!isUserInteracting) {
      timerRef.current = setInterval(() => {
        setActiveMainSlide(prev => (prev + 1) % mainSlides?.length);
      }, autoSlideInterval);

      return () => clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [mainSlides?.length, autoSlideInterval, isUserInteracting]);

  useEffect(() => {
    if (!isUserInteracting) {
      sideTimersRef.current.forEach((timer, index) => {
        if (timer) clearInterval(timer);

        sideTimersRef.current[index] = setInterval(() => {
          setActiveSideSlides(prev => {
            const newSlides = [...prev];
            newSlides[index] = (newSlides[index] + 1) % sideSlidesGroups[index].length;
            return newSlides;
          });
        }, autoSlideInterval + index * 1000);
      });

      return () => sideTimersRef.current.forEach(timer => clearInterval(timer));
    }

    return () => sideTimersRef.current.forEach(timer => clearInterval(timer));
  }, [sideSlides, autoSlideInterval, isUserInteracting]);

  const handleInfiniteScroll = (direction, sliderRef, totalSlides) => {
    if (!sliderRef.current) return;
    const containerWidth = sliderRef.current.offsetWidth;
    const currentScroll = sliderRef.current.scrollLeft;
    const maxScroll = containerWidth * (totalSlides - 1);

    if (direction === 'right' && Math.abs(currentScroll - maxScroll) < 20) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
    if (direction === 'left' && currentScroll < 20) {
      sliderRef.current.scrollTo({ left: maxScroll, behavior: 'auto' });
    }
  };

  useEffect(() => {
    if (mainSliderRef.current && !isDragging) {
      mainSliderRef.current.scrollTo({
        left: activeMainSlide * mainSliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [activeMainSlide, isDragging]);

  useEffect(() => {
    if (!isDragging) {
      sideSliderRefs.forEach((ref, index) => {
        if (ref.current) {
          ref.current.scrollTo({
            left: activeSideSlides[index] * ref.current.offsetWidth,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [activeSideSlides, isDragging]);

  useEffect(() => {
    const handleResize = () => {
      if (!isDragging) {
        if (mainSliderRef.current) {
          mainSliderRef.current.scrollTo({
            left: activeMainSlide * mainSliderRef.current.offsetWidth,
            behavior: 'auto'
          });
        }
        sideSliderRefs.forEach((ref, index) => {
          if (ref.current) {
            ref.current.scrollTo({
              left: activeSideSlides[index] * ref.current.offsetWidth,
              behavior: 'auto'
            });
          }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeMainSlide, activeSideSlides, isDragging]);

  const handleMouseDown = (e, ref, index, isMain = true) => {
    setIsDragging(true);
    setIsUserInteracting(true);
    setStartX(e.pageX || e.touches[0].pageX);
    setScrollLeft(ref.current.scrollLeft);

    clearInterval(timerRef.current);
    sideTimersRef.current.forEach(timer => clearInterval(timer));
  };

  const handleMouseMove = (e, ref, index, isMain = true) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - startX) * 2;
    const direction = walk < 0 ? 'right' : 'left';

    ref.current.scrollLeft = scrollLeft - walk;

    const totalSlides = isMain ? mainSlides.length : sideSlidesGroups[index].length;
    handleInfiniteScroll(direction, ref, totalSlides);
  };

  const handleMouseUp = (e, ref, index, isMain = true) => {
    setIsDragging(false);
    setTimeout(() => setIsUserInteracting(false), 1000);

    const slideWidth = ref.current.offsetWidth;
    const newIndex = Math.round(ref.current.scrollLeft / slideWidth);

    if (isMain) {
      setActiveMainSlide(Math.max(0, Math.min(newIndex, mainSlides.length - 1)));
    } else {
      const safeIndex = Math.max(0, Math.min(newIndex, sideSlidesGroups[index].length - 1));
      const updatedSlides = [...activeSideSlides];
      updatedSlides[index] = safeIndex;
      setActiveSideSlides(updatedSlides);
    }

    ref.current.scrollTo({
      left: newIndex * slideWidth,
      behavior: 'smooth'
    });
  };

  useLayoutEffect(() => {
    if (mainSliderRef.current) mainSliderRef.current.scrollLeft = 0;
    sideSliderRefs.forEach(ref => {
      if (ref.current) ref.current.scrollLeft = 0;
    });
    setActiveMainSlide(0);
    setActiveSideSlides([0, 0, 0]);
  }, []);

  // Custom touch listeners for passive false
  useEffect(() => {
    const ref = mainSliderRef.current;
    const handler = (e) => handleMouseMove(e, ref, 0, true);
    if (ref) ref.addEventListener('touchmove', handler, { passive: false });

    return () => ref?.removeEventListener('touchmove', handler);
  }, []);

  useEffect(() => {
    sideSliderRefs.forEach((ref, index) => {
      const handler = (e) => handleMouseMove(e, ref, index, false);
      if (ref.current) {
        ref.current.addEventListener('touchmove', handler, { passive: false });
      }
      return () => ref.current?.removeEventListener('touchmove', handler);
    });
  }, []);

  // Divide sideSlides into 3 groups
  const sideSlidesGroups = [[], [], []];
  sideSlides?.forEach((slide, index) => {
    const group = index % 3;
    sideSlidesGroups[group].push(slide);
  });

  return (
    <div className={`${styles.heroSliderContainer}  ${!(sideSlides?.length>0) && styles.showSide}`} style={customStyles}>
      {mainSlides?.length>0&&<div className={`${styles.mainSliderWrapper}`}>
        <div
          className={styles.mainSlider}
          ref={mainSliderRef}
          onMouseDown={(e) => handleMouseDown(e, mainSliderRef)}
          onMouseMove={(e) => handleMouseMove(e, mainSliderRef)}
          onMouseUp={(e) => handleMouseUp(e, mainSliderRef)}
          onMouseLeave={(e) => handleMouseUp(e, mainSliderRef)}
          onTouchStart={(e) => handleMouseDown(e, mainSliderRef)}
          onTouchEnd={(e) => handleMouseUp(e, mainSliderRef)}
        >
          {mainSlides?.map((slide) => (
            <Link to={slide.link} key={slide.id} className={styles.mainSlide}>
              <picture>
                {slide.imgMobile && <source srcSet={slide.imgMobile} media="(max-width: 480px)" />}
                {slide.imgTablet && <source srcSet={slide.imgTablet} media="(max-width: 1024px)" />}
                <img
                  src={slide.imgDesktop}
                  alt={slide.altText}
                  className={styles.slideImage}
                  draggable="false"
                  loading="lazy"
                />
              </picture>
            </Link>
          ))}
        </div>
      </div>}

      {sideSlides?.length>0&&<div className={styles.sideSliders}>
        {sideSlidesGroups.map((group, sliderIndex) => (
          <div key={sliderIndex} className={styles.sideSliderContainer}>
            <div
              className={styles.sideSliderWrapper}
              ref={sideSliderRefs[sliderIndex]}
              onMouseDown={(e) => handleMouseDown(e, sideSliderRefs[sliderIndex], sliderIndex, false)}
              onMouseMove={(e) => handleMouseMove(e, sideSliderRefs[sliderIndex], sliderIndex, false)}
              onMouseUp={(e) => handleMouseUp(e, sideSliderRefs[sliderIndex], sliderIndex, false)}
              onMouseLeave={(e) => handleMouseUp(e, sideSliderRefs[sliderIndex], sliderIndex, false)}
              onTouchStart={(e) => handleMouseDown(e, sideSliderRefs[sliderIndex], sliderIndex, false)}
              onTouchEnd={(e) => handleMouseUp(e, sideSliderRefs[sliderIndex], sliderIndex, false)}
            >
              {group.map((slide) => (
                <Link to={slide.link} key={slide.id} className={styles.sideSlide}>
                  <picture>
                    {slide.imgMobile && <source srcSet={slide.imgMobile} media="(max-width: 480px)" />}
                    {slide.imgTablet && <source srcSet={slide.imgTablet} media="(max-width: 1024px)" />}
                    <img
                      src={slide.imgDesktop}
                      alt={slide.altText}
                      className={styles.slideImage}
                      draggable="false"
                      loading="lazy"
                    />
                  </picture>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
};

export default HeroBanner;

