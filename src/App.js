import { CssBaseline } from "@mui/material";
import { useRoutes } from "react-router-dom";
import { MatxTheme } from "./components";
import { AuthProvider } from "./contexts/JWTAuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import routes from "./pages/routes";
import { Toaster } from "react-hot-toast";
import "../src/css/common-class.css";
const App = () => {
  const content = useRoutes(routes);

  return (
    <SettingsProvider>
      <AuthProvider>
        <MatxTheme>
          <Toaster position="top-center" reverseOrder={false} />
          <CssBaseline />
          {content}
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
  );
};

export default App;
