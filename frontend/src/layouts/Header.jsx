import { Link } from "react-router-dom";
import Logo from "../assets/chubut.svg";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 w-full">
        {/* Logo */}
        <div className="flex-none">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="h-8" /> {/* Ajusta el tamaño según sea necesario */}
          </Link>
        </div>
      </div>
    </header>
  );
}
