import { Routes } from './routes/Routes';
import { Outlet, RouterProvider } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AlertMessage from './components/AlertMessage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow mx-8 sm:mx-12 md:mx-24 lg:mx-48 xl:mx-80">
        <Outlet />
        <AlertMessage />
      </div>
      <Footer />
    </div>
  );
}

export default App;
