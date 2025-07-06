import './App.css';
import { Route, Routes } from "react-router-dom";
import Root from './components/view/root';
import { AuthProvider } from "./components/services/AuthContext";
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter as Router } from 'react-router-dom';
// import AppRoutes from './routes';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/*" element={<Root />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;
