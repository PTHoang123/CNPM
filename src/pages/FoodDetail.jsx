import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";    // ← fixed import
import Helmet from "../components/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import "../styles/product-details.css";
import ProductCard from "../components/UI/ProductCard";
const images = require.context("../assets/images", false, /\.(png|jpe?g|svg)$/);
const FoodDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [previewImg, setPreviewImg] = useState("");
  const [tab, setTab] = useState("desc");
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");

  // fetch the product once
  useEffect(() => {
    fetch(`http://localhost:8000/api/foods/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (product) {
      setPreviewImg(images(`./${product.image01}`));
      window.scrollTo(0, 0);
    }
  }, [product]);

  // early return while loading
  if (!product) {
    return <p>Loading…</p>;
  }
   const addToCartHandler = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_code: id, quantity }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      const result = await res.json();
      alert(`Added ${quantity} item(s) of ${title} to your cart.`);
      // navigate("/cart"); // ← optionally redirect to cart page
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  const { title, price, category, description: desc, image01, image02, image03 } = product;
  const incQty = () => setQuantity((q) => q + 1);
  const decQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(enteredName, enteredEmail, reviewMsg);
  };

  return (
    <Helmet title="Product-details">
      <CommonSection title={title} />

      <section>
        <Container>
          <Row>
            {/* thumbnails */}
            <Col lg="2" md="2">
              {[image01, image02, image03].map((img, i) => (
                <div
                  key={i}
                  className="img__item mb-3"
                  onClick={() => setPreviewImg(img)}
                >
                  <img src={img} alt="" className="w-50" />
                </div>
              ))}
            </Col>

            <Col lg="4" md="4">
              <div className="product__main-img">
                <img src={previewImg} alt="" className="w-100" />
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__title mb-3">{title}</h2>
                <p className="product__price">
                  Price: <span>${price}</span>
                </p>
                <p className="category mb-5">
                  Category: <span>{category}</span>
                </p>
                <div className="product__quantity d-flex align-items-center gap-3 mb-4">
                  <button onClick={decQty} className="qty__btn">-</button>
                  <span className="qty__number">{quantity}</span>
                  <button onClick={incQty} className="qty__btn">+</button>
                </div>

                <button onClick={addToCartHandler} className="addTOCart__btn">
                  Add to Cart
                </button>

                {/* ... quantity, add to cart ... */}
                <button className="addTOCart__btn">
                  <Link to="/food" className="go-back">
                    Go Back
                  </Link>
                </button>
              </div>
            </Col>

            {/* tabs */}
            <Col lg="12">
              <div className="tabs d-flex align-items-center gap-5 py-3">
                <h6
                  className={tab === "desc" ? "tab__active" : ""}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={tab === "rev" ? "tab__active" : ""}
                  onClick={() => setTab("rev")}
                >
                  Review
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content">
                  <p>{desc}</p>
                </div>
              ) : (
                <div className="tab__form mb-3">
                  {/* existing reviews */}
                  <form className="form" onSubmit={submitHandler}>
                    {/* name, email, message inputs */}
                    <button type="submit" className="addTOCart__btn">
                      Submit
                    </button>
                  </form>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default FoodDetails;