import React from 'react';
import { Routes, Route } from 'react-router';
import Home from '../pages/Home';
import AllFood from '../pages/AllFood';
import FoodDetail from '../pages/FoodDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/CheckOut';

const Router = () => (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/food' element={<AllFood />} />
    <Route path='/fooddetail/:id' element={<FoodDetail />} />
    <Route path='/cart' element={<Cart />} />
    <Route path='/checkout' element={<Checkout />} />
  </Routes>
);

export default Router;