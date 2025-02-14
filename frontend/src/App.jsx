import AppRouter from "./routers/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <AuthProvider>
      <MainLayout>
        <AppRouter />
      </MainLayout>
    </AuthProvider>
  );
}

export default App;
