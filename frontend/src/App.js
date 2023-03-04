import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./component/layout/Header/Header";
import WebFont from "webfontloader";
import React, { useEffect, useState } from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetail from "./component/productDetail/ProductDetail";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignup from "./component/User/LoginSignup";
import store from "./Store";
import { loadUser } from "./actions/userAction";
import UserOption from "./component/layout/Header/UserOption";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile";
import UpdatedProfile from "./component/User/UpdatedProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import axios from "axios";
import Payment from "./component/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrder from "./component/Order/MyOrder";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import Order from "./component/Admin/Order";
import ProcessOrder from "./component/Admin/ProcessOrder";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setstripeApiKey] = useState("");
  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    // console.log("data", data);
    setstripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);
  // console.log("user", user?.role);
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOption user={user} />}

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetail />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/account" element={isAuthenticated && <Profile />} />
        <Route
          exact
          path="/me/update"
          element={isAuthenticated && <UpdatedProfile />}
        />
        <Route
          exact
          path="/password/update"
          element={isAuthenticated && <UpdatePassword />}
        />
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route
          exact
          path="/password/reset/:token"
          element={<ResetPassword />}
        />
        <Route exact path="/login" element={<LoginSignup />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route
          exact
          path="/login/shipping"
          element={isAuthenticated && <Shipping />}
        />
        <Route
          exact
          path="/order/confirm"
          element={isAuthenticated && <ConfirmOrder />}
        />

        <Route
          exact
          path="/process/payment"
          element={
            stripeApiKey && (
              <Elements stripe={loadStripe(stripeApiKey)}>
                {isAuthenticated && <Payment />}
              </Elements>
            )
          }
        />
        <Route
          exact
          path="/success"
          element={isAuthenticated && <OrderSuccess />}
        />
        <Route exact path="/orders" element={isAuthenticated && <MyOrder />} />
        <Route
          exact
          path="/order/:id"
          element={isAuthenticated && <OrderDetails />}
        />

        <Route
          exact
          path={user?.role === "admin" ? "/admin/dashboard" : "/login"}
          element={isAuthenticated && <Dashboard />}
        />
        <Route
          exact
          path={user?.role === "admin" ? "/admin/products" : "/login"}
          element={isAuthenticated && <ProductList />}
        />
        <Route
          exact
          path={user?.role === "admin" ? "/admin/product" : "/login"}
          element={isAuthenticated && <NewProduct />}
        />
        <Route
          exact
          path={user?.role === "admin" ? "/admin/product/:id" : "/login"}
          element={isAuthenticated && <UpdateProduct />}
        />
         <Route
          exact
          path={user?.role === "admin" ? "/admin/orders" : "/login"}
          element={isAuthenticated && <Order />}
        />
        <Route
          exact
          path={user?.role === "admin" ? "/admin/order/:id" : "/login"}
          element={isAuthenticated && <ProcessOrder />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
