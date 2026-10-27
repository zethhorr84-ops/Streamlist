import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Cart from './pages/Cart';
import About from './pages/About';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import './App.css';

function ApplicationShell() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="footer"><p>© 2026 EZTechMovie - StreamList</p></footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<ProtectedRoute><ApplicationShell /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
