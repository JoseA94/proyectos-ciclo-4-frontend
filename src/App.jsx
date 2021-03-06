import React, { useState, useEffect } from "react";
import PrivateLayout from "layouts/PrivateLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "context/userContext";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Index from "pages/Index";
import IndexUsuarios from "pages/usuarios";
import EditarUsuario from "pages/usuarios/editar";
import AuthLayout from "layouts/AuthLayout";
import Register from "pages/auth/register";
import Login from "pages/auth/login";
import { AuthContext } from "context/authContext";
import IndexProyectos from "pages/proyectos/Index";
import jwt_decode from "jwt-decode";
import "styles/globals.css";
import "styles/style.css";
import "styles/tabla.css";
import NuevoProyecto from "pages/proyectos/NuevoProyecto";
import IndexInscripciones from "pages/inscripciones";
import PageProyecto from "pages/proyectos/Proyecto";
import Perfil from "pages/usuarios/perfil";
import ProyectosLider from "pages/proyectos/ProyectosLider";
import IndexAvances from "pages/avances";
import EditarObservaciones from "pages/avances/observaciones";
import EditarDescripcion from "pages/avances/editarDescripcion";
import CrearAvance from "pages/avances/crearAvance";
// import PrivateRoute from 'components/PrivateRoute';

const httpLink = createHttpLink({
  uri: "https://server-js-ciclo4.herokuapp.com/graphql",
  //uri: 'http://localhost:4000/graphql',
});

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
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

function App() {
  const [userData, setUserData] = useState({});
  const [authToken, setAuthToken] = useState("");

  const setToken = (token) => {
    console.log("set token", token);
    setAuthToken(token);
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    if (authToken) {
      const decoded = jwt_decode(authToken);
      setUserData({
        _id: decoded._id,
        nombre: decoded.nombre,
        apellido: decoded.apellido,
        identificacion: decoded.identificacion,
        correo: decoded.correo,
        rol: decoded.rol,
        estado: decoded.estado,
      });
    }
  }, [authToken]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ authToken, setAuthToken, setToken }}>
        <UserContext.Provider value={{ userData, setUserData }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PrivateLayout />}>
                <Route path="" element={<Index />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/usuarios" element={<IndexUsuarios />} />
                <Route
                  path="/usuarios/editar/:_id"
                  element={<EditarUsuario />}
                />
                <Route path="/proyectos" element={<IndexProyectos />} />
                <Route
                  path="/proyectos/:idProyecto"
                  element={<PageProyecto />}
                />
                <Route
                  path="/proyectos/mis-proyectos/:idLider"
                  element={<ProyectosLider />}
                />

                <Route path="/proyectos/nuevo" element={<NuevoProyecto />} />
                <Route path="/inscripciones" element={<IndexInscripciones />} />
                <Route path="/avances" element={<IndexAvances />} />
                <Route
                  path="/avances/observaciones/:_id"
                  element={<EditarObservaciones />}
                />
                <Route
                  path="/avances/descripcion/:_id"
                  element={<EditarDescripcion />}
                />
                <Route path="/avances/nuevo/:_id" element={<CrearAvance />} />
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
