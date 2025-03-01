import Header from "./Header";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
