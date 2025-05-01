import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Navbar, Cart, Login, SignUp, Main, MainHeader } from "./components";
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
        <MainHeader/>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<SignUp/>}/>
        </Routes>
    </BrowserRouter>
  </StrictMode>
);
