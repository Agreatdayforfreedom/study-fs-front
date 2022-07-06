import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/authContext";
import { REFRESH_TOKEN } from "../graphql/auth/mutations";

const PrivateLayout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [
    refreshToken,
    { data: dataMutation, loading: loadingMutation, error: errorMutation },
  ] = useMutation(REFRESH_TOKEN);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  useEffect(() => {
    if (dataMutation) {
      console.log(dataMutation);
      if (dataMutation.refreshToken.token) {
        setToken(dataMutation.refreshToken.token);
      } else {
        setToken(null);
        navigate("/auth/login");
      }
      setLoadingAuth(false);
    }
  }, [dataMutation, setToken, loadingAuth, navigate]);
  // useEffect(() => {
  //   console.log("TOKKKEN", authToken);
  // }, [authToken]);
  if (loadingMutation || loadingAuth) return <div>Loading...</div>;
  // if (!authToken) {
  // }

  return (
    <div className="flex flex-col md:flex-row flex-no-wrap h-screen">
      <Sidebar />
      <div className="flex w-full h-full">
        <div className="w-full h-full  overflow-y-scroll">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PrivateLayout;
