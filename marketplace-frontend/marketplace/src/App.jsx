"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "./helpers/persistance-storage";
import { Routes, Route } from "react-router-dom";
import { Navbar, Cart, Main, MainHeader } from "./components";
import { signUserSuccess } from "./slice/authSlice";
import AuthService from "./service/auth";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = getItem("token");
    if (token) {
      const getUser = async () => {
        try {
          const response = await AuthService.getUser();
          dispatch(signUserSuccess(response.user));
        } catch (error) {
          console.log("Error getting user:", error);
        }
      };
      getUser();
    }
  }, [dispatch]);

  useEffect(() => {
    const hasLoggedIn = sessionStorage.getItem("hasLoggedIn");
    if (hasLoggedIn) {
      toast({
        title: "Tizimga muoffaqiyatli kirdingiz!",
        duration: 4000,
        className: "bg-green-700 text-white shadow-lg",
      });
      setTimeout(() => {
        sessionStorage.removeItem("hasLoggedIn");
      }, 2000);
    }
  }, []);

  return (
    <>
      <MainHeader />
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Toaster />
    </>
  );
};

export { App };
