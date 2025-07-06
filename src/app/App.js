import { BrowserRouter, Route, Routes,Outlet,Navigate } from 'react-router-dom';
import './App.css';
import Rootroutes from './components/view/rootroutes';
import { getCookie } from './components/services/cookie';
import Login from './components/auth/login.js'
import ResetPassword from './components/auth/resetPassword.js'
import { NotificationContainer } from 'react-notifications'

const AuthRoute = () => {
  let token = getCookie("token");

  let auth = { 'token': token }
  
  return (
    auth.token ? <Outlet /> : <Navigate to={`/login`} />
  )
}

function App() {
  return (
    <div className="App">
        <NotificationContainer/>
      <BrowserRouter> 
      <Routes>
       <Route element={<AuthRoute />}>
          <Route path={`/*`} element={<Rootroutes />} />
        </Route>
        
        <Route path={`/login`} element={<Login />} />
        <Route path={`/reset`} element={<ResetPassword />} />

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
