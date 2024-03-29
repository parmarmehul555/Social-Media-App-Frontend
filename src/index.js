import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import UserModelProvider from './components/UserModelProvider';
import Account from './components/Account';
import EditProfile from './components/EditProfile';
import Home from './components/Home';
import { Provider } from 'react-redux';
import store from './store';
import Chat from './components/Chat';
import { MyChats } from './components/MyChats';
import { ChakraProvider } from '@chakra-ui/react';
import ForgotPassword from './components/ForgortPassword';
import Setting from './components/Setting';
import AdminModelProvider from './components/AdminModelProvider';
import Dashboard from './components/Dashboard';
import AdminUserProfile from './components/AdminUserProfile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/login' element={<UserModelProvider isLogin="true" />} />
            <Route path='/signup' element={<UserModelProvider />} />
            <Route path='/profile' element={<Account />} />
            <Route path='/editprofile' element={<EditProfile />} />
            <Route path='/home' element={<Home />} />
            {/* <Route path='/chat' element={<Chat/>}/> */}
            <Route path='/chat/:chatId' element={<Chat />} />
            <Route path='/login/forgotpassword' element={<ForgotPassword />} />
            <Route path='/setting' element={<Setting />} />
            <Route path='/admin/login' element={<AdminModelProvider isLogin="true" />}></Route>
            <Route path='/admin/signup' element={<AdminModelProvider />}></Route>
            <Route path='/admin/dashboard' element={<Dashboard/>}></Route>
            <Route path='/admin/user/:userId' element={<AdminUserProfile/>}></Route>
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </ChakraProvider>
);

