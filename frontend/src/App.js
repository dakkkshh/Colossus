import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import BookNow from './pages/BookNow';
import Main from './layout/Main';
import React, { useEffect, useState } from 'react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import ManageSpaces from './pages/ManageSpaces';
import AdminPanel from './pages/AdminPanel';
import BookingConfirmed from './pages/ConfirmedBooking'
import { message } from 'antd';
import { _fetch } from './_fetch';
import { login } from './store/action/user';
import Loader from './components/Loader';
import { bgColor } from './constants/colors';
import { user_roles } from './constants/user_roles';

function LayoutWrapper({ children, email }) {
  if (!email || email.length === 0) {
    return (
      <Navigate to='/login' />
    );
  }
  return (
    <Main>
      {children}
    </Main>
  );
}

function App() {
  const dispatch = useDispatch();
  const [cookie, setCookie] = useCookies(['colossus-userinfo']);
  const [loading, setLoading] = useState(true);
  let { email, role } = useSelector(st => st.user);

  const init = async () => {
    try {
      setLoading(true);
      if (cookie['colossus-userinfo']?._id) {
        let res = await _fetch(`${process.env.REACT_APP_API_URL}/user/${cookie['colossus-userinfo']?._id}`, {
          credentials: 'include'
        });
        res = await res.json();
        if (res.status === 200) {
          dispatch(login(res.response));
        }
      } else {
        console.log('No Cookie');
      }
    } catch (err) {
      console.log(err);
      message.error('Something went wrong, please try again later');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: bgColor
        }}
      >
        <Loader />
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className='App'>
        <Routes>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/booknow' element={<BookNow />} />
          <Route exact path='/booking-confirmed' element={<BookingConfirmed />} />
          <Route exact path='/' element={<LayoutWrapper children={<Home />} email={email} />} />
          <Route exact path='/profile' element={<LayoutWrapper children={<Profile />} email={email} />} />
          <Route exact path='/bookings' element={<LayoutWrapper children={<Bookings />} email={email} />} />
          {
            role === user_roles.ADMIN && (
              <Route exact path='/manage-spaces' element={<LayoutWrapper children={<ManageSpaces />} email={email} />} />
            ) 
          }
          {
            role === user_roles.ADMIN && (
              <Route exact path='/admin-panel' element={<LayoutWrapper children={<AdminPanel />} email={email} />} />
            ) 
          }
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
