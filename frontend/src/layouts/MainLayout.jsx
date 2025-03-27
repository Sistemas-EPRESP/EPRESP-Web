import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";

const MainLayout = ({ children }) => {
  return (
    <div role="document" className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
