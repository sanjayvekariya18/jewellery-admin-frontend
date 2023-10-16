import { createContext, useEffect, useReducer } from "react";
import { MatxLoading } from "../components";
import AuthStorage from "../utils/authStorage";
import { apiEndPoint } from "../constants/routesList";
import { API } from "../services";

const initialState = {
  user: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  },
  isInitialised: false,
  isAuthenticated: false,
};

// const isValidToken = (accessToken) => {
//   if (!accessToken) return false;

//   const decodedToken = jwtDecode(accessToken);
//   const currentTime = Date.now() / 1000;
//   return decodedToken.exp > currentTime;
// };

// const setSession = (accessToken) => {
//   if (accessToken) {
//     localStorage.setItem('accessToken', accessToken);
//     axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//   } else {
//     localStorage.removeItem('accessToken');
//     delete axios.defaults.headers.common.Authorization;
//   }
// };

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialised: true, user };
    }

    case "LOGIN": {
      const { user } = action.payload;
      return { ...state, isAuthenticated: true, user };
    }

    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }

    case "REGISTER": {
      const { user } = action.payload;

      return { ...state, isAuthenticated: true, user };
    }

    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password, remember) => {
    const response = await API.post(apiEndPoint.login, { email, password });
    const { token, user } = response;
    AuthStorage.setStorageData(
      AuthStorage.STORAGEKEY.access_token,
      token,
      remember
    );
    AuthStorage.setStorageJsonData(
      AuthStorage.STORAGEKEY.userData,
      user,
      remember
    );

    dispatch({ type: "LOGIN", payload: { user } });
  };

  const register = async (email, username, password) => {
    const response = await API.post("/api/auth/register", {
      email,
      username,
      password,
    });
    const { user } = response.data;

    dispatch({ type: "REGISTER", payload: { user } });
  };

  const logout = () => {
    AuthStorage.deauthenticateUser();
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    if (AuthStorage.isUserAuthenticated(AuthStorage.STORAGEKEY.userData)) {
      dispatch({
        type: "INIT",
        payload: {
          isAuthenticated: true,
          user: AuthStorage.getStorageJsonData(AuthStorage.STORAGEKEY.userData),
        },
      });
    } else {
      dispatch({
        type: "INIT",
        payload: { isAuthenticated: false, user: null },
      });
    }
  }, []);

  // SHOW LOADER
  if (!state.isInitialised) return <MatxLoading />;

  return (
    <AuthContext.Provider
      value={{ ...state, method: "JWT", login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
