import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg'; // Adjust the path to your logo file

function Header() {
  return (
    <header className="bg-emerald-800 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-4" /> {/* Logo with some styling */}
        <h1 className="text-2xl font-bold">Hen(ch)ry Lifts</h1>
      </div>
      <nav>
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/log">Workout Log</Link>
      </nav>
    </header>
  );
}

export default Header;
