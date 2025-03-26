"use client";

import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { logout, isAuthenticated, cooperativa } = useContext(AuthContext);

  return (
    <header className="sticky top-0 w-full border-b bg-gradient-to-r from-blue-900 to-blue-800 py-2 px-4 shadow-lg z-10">
      <div className="flex h-20 items-center justify-between w-full container mx-auto">
        <Logo />

        {/* Componente UserMenu */}
        <UserMenu isAuthenticated={isAuthenticated} cooperativa={cooperativa} onLogout={logout} />
      </div>
    </header>
  );
}
