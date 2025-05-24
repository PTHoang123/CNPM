import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet";
import "../styles/cart-page.css";
import { Container, Row, Col } from "reactstrap";
const images = require.context("../assets/images", false, /\.(png|jpe?g|svg)$/);
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/cart")
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch(console.error);
  }, []);
  // 1.6 cập nhật số lượng và tổng đơn hàng
  const totalAmount = cartItems.reduce(
  (sum, item) => sum + parseFloat(item.price) * item.quantity,
  0
);


  const handleDelete = async (product_code) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/cart/${product_code}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete item");
      setCartItems((prev) =>
        prev.filter((it) => it.product_code !== product_code)
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <Helmet title="Cart">
      <CommonSection title="Your Cart" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {cartItems.length === 0 ? (
                <h5 className="text-center">Your cart is empty</h5>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.product_code}>
                        <td className="text-center cart__img-box">
                          <img
                            src={images(`./${item.image}`)}
                            alt={item.title}
                            style={{ maxWidth: 80 }}
                          />
                        </td>
                        <td className="text-center">{item.title}</td>
                        <td className="text-center">
                          ${parseFloat(item.price).toFixed(2)}
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center cart__item-del">
                          <i
                            className="ri-delete-bin-line"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(item.product_code)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {cartItems.length > 0 && (
                <div className="mt-4">
                  <h6>
                    Subtotal: $
                    <span className="cart__subtotal">
                      {totalAmount.toFixed(2)}
                    </span>
                  </h6>
                  <p>Taxes and shipping will calculate at checkout</p>
                  <div className="cart__page-btn">
                    <button className="addTOCart__btn me-4">
                      <Link to="/food" className="link-to">Continue Shopping</Link>
                    </button>
                    {/* 1.7 Người dùng ấn vào nút "Proceed to checkout" sẽ chuyển đến trang thanh toán */}
                    <button className="addTOCart__btn text-decoration-none">
                      {/* 1.8 Chuyển đến trang thanh toán */}
                      <Link to="/checkout" className="link-to">Proceed to checkout</Link>
                    </button>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Cart;