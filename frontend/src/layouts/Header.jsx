"use client";

import Logo from "./Logo";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 w-full border-b bg-gradient-to-r from-blue-900 to-blue-800 py-2 px-4 shadow-lg z-10">
      <div className="flex h-20 items-center justify-between w-full container mx-auto">
        <Logo />

        {/* Componente UserMenu */}
        <UserMenu />
      </div>
    </header>
  );
}
