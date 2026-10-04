import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Movies from './pages/Movies';
import Cart from './pages/Cart';
import About from './pages/About';

import './App.css';

function App() {
  return (
    <div className="app">

      <Navbar />

      <main className="main-content">

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/movies"
            element={<Movies />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/about"
            element={<About />}
          />

        </Routes>

      </main>

      <footer className="footer">

        <p>
          © 2026 EZTechMovie - StreamList
        </p>

      </footer>

    </div>
  );
}

export default App;