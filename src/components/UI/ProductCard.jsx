
import React from "react";
import { Link } from "react-router-dom"; 
import "../../styles/product-card.css";


const images = require.context("../../assets/images", false, /\.(png|jpe?g|svg)$/);

const ProductCard = ({ item }) => {
  const { product_code, title, image01, price } = item;
  const imgUrl = images(`./${image01}`);

  return (
    <div className="product__item">
      <div className="product__img">
        <img src={imgUrl} alt={title} className="w-100" />
      </div>
      <div className="product__content">
        <h5>
          {/* 1.3 Người dùng nhấn vào tên sản phẩm */}
          <Link to={`/fooddetail/${product_code}`}>{title}</Link>
        </h5>
        <div className="d-flex align-items-center justify-content-between">
          <span className="product__price">${price}</span>
          <button className="addTOCart__btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;