import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import {Route, Routes} from "react-router-dom";
import Order from "./pages/Order";
import AuthChecker from "./components/AuthChecker";
const App = () => {
  return (
    <main className='overflow-hidden bg-primary'>
      <Header />
      {/* <AuthChecker /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </main>
  );
};

export default App;
