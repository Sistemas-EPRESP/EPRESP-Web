import Header from "./Header";

const MainLayout = ({ children }) => {
  return (
    <div role="document" className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">{children}</main>
      <footer className="bg-gray-100 text-center py-4">
        <p className="text-sm text-gray-600">© 2025 EPRESP Chubut. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
