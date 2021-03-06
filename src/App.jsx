import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import PrivateLayout from './layout/PrivateLayout';
import UserIndex from './pages/users/UserIndex';
import Editar from './pages/users/editar';
import AuthLayout from './layout/AuthLayout';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import { AuthContext } from './context/authContext';
import { UserContext } from './context/userContext';
import ProjectIndex from './pages/projects/ProjectIndex';
import NewProject from './pages/projects/NewProject';
import InscriptionsIndex from './pages/inscriptions/InscriptionsIndex';
import Profile from './pages/profile';

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [userData, setUserData] = useState({});
  const [authToken, setAuthToken] = useState('');

  const setToken = (token) => {
    // console.log(token, "SETTOKEN");
    setAuthToken(token);
    console.log('TOKEN', token);
    if (token) {
      localStorage.setItem('token', token);
    } else if (token === null) {
      localStorage.removeItem('token');
    }
  };
  useEffect(() => {
    if (authToken) {
      const decoded = jwt_decode(authToken);
      console.log(decoded);
      setUserData({
        _id: decoded._id,
        nombre: decoded.nombre,
        apellido: decoded.apellido,
        identificacion: decoded.identificacion,
        correo: decoded.correo,
        rol: decoded.rol,
        foto: decoded.foto,
      });
    }
  }, [authToken]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ authToken, setAuthToken, setToken }}>
        <UserContext.Provider value={{ userData, setUserData }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' exact element={<PrivateLayout />}>
                <Route index element={<UserIndex />} />
                <Route path='/editar/:_id' element={<Editar />} />
                <Route path='/projects' element={<ProjectIndex />} />
                <Route path='/proyectos/nuevo' element={<NewProject />} />
                <Route path='/inscripciones' element={<InscriptionsIndex />} />
                <Route path='/profile' element={<Profile />} />
              </Route>
              <Route path='/auth' element={<AuthLayout />}>
                <Route path='register' element={<Register />} />
                <Route path='login' element={<Login />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
