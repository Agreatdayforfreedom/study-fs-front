import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import PrivateLayout from "./layout/PrivateLayout";
import UserIndex from "./pages/users/UserIndex";
import Editar from "./pages/users/editar";
import AuthLayout from "./layout/AuthLayout";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { useEffect, useState } from "react";
import { AuthContext } from "./context/authContext";
import jwt_decode from "jwt-decode";
import { UserContext } from "./context/userContext";
const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JSON.parse(localStorage.getItem("token"));
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [userData, setUserData] = useState({});
  const [authToken, setAuthToken] = useState("");

  const setToken = (token) => {
    setAuthToken(token);
    console.log("TOKEN", token);
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    } else if (token === null) {
      localStorage.removeItem("token");
    }
  };
  useEffect(() => {
    if (authToken) {
      const decoded = jwt_decode(authToken);
      console.log(decoded);
      setUserData({
        nombre: decoded.nombre,
        apellido: decoded.apellido,
        identificacion: decoded.identificacion,
        correo: decoded.correo,
        rol: decoded.rol,
      });
    }
  }, [authToken]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ authToken, setAuthToken, setToken }}>
        <UserContext.Provider value={{ userData, setUserData }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" exact element={<PrivateLayout />}>
                <Route index element={<UserIndex />} />
                <Route path="/editar/:_id" element={<Editar />} />
              </Route>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
