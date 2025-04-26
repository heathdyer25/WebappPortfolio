import React, {Suspense, lazy} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DeckPage from './pages/DeckPage';
import ProfilePage from './pages/ProfilePage';
import OfflineBattlePage from './pages/OfflineBattlePage';
import OnlineBattlePage from './pages/OnlineBattlePage';

import OfflinePage from './pages/OfflinePage';
import ErrorPage from './pages/ErrorPage';

import './styles/main.css';

function lazyWithOfflineFallback(importFunc) {
  return lazy(() =>
    importFunc().catch(error => {
      if (error.name === 'ChunkLoadError') {
        window.location.href = '/offline';
      }
      throw error;
    })
  );
}

const ShopPage = lazy(() => import(/* webpackChunkName: "shop-page" */ './pages/ShopPage'));
const SettingsPage = lazy(() =>  import(/* webpackChunkName: "settings-page" */ './pages/SettingsPage'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect if user is logged in */}
          <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
          <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />

          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute element={<HomePage />} />}/>
          <Route path="/home" element={<PrivateRoute element={<HomePage />} />}/>
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />}/>
          <Route path="/settings" element={<PrivateRoute element={<SettingsPage />} />}/>
          <Route path="/deck" element={<PrivateRoute element={<DeckPage />} />}/>
          <Route path="/shop" element={<PrivateRoute element={<ShopPage />} />}/>
          <Route path="/offline-battle" element={<PrivateRoute element={<OfflineBattlePage />} />}/>
          <Route path="/online-battle" element={<PrivateRoute element={<OnlineBattlePage />} />}/>

          {/* Unkown routes */}
          <Route path="/offline" element={<OfflinePage/>}/>
          <Route path="/*" element={<ErrorPage/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
