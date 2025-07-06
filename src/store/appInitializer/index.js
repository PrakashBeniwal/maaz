import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeExpiredRecentlyViewed } from '../slices/recentlyViewedSlice.js';

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear expired recently viewed products on initial app load
    dispatch(removeExpiredRecentlyViewed());
  }, [dispatch]);

  return null; // This component only handles logic, nothing to render
};

export default AppInitializer;

