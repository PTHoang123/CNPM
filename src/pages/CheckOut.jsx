// filepath: src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet";
import "../styles/checkout.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log("Stripe key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// card test success :  4242 4242 4242 4242
// card test failure : 4000 0000 0000 9995
function CheckoutForm({ cartItems, shippingCost }) {
  const stripe = useStripe();
  const elements = useElements();

  const [enterName, setEnterName] = useState("");
  const [enterEmail, setEnterEmail] = useState("");
  const [enterNumber, setEnterNumber] = useState("");
  const [enterCountry, setEnterCountry] = useState("");
  const [enterCity, setEnterCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!enterEmail || !enterEmail.includes("@")) {
      alert("Please enter a valid email");
      return;
    }
    setLoading(true);
    const res = await fetch(
  "http://localhost:8000/api/payments/create-checkout-session",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: cartItems.map((it) => ({
        product_code: it.product_code,
        title: it.title,
        price: it.price,
        quantity: it.quantity,
        imageUrl: it.image,
      })),
      shippingCost,
      customer: {
        name: enterName,
        email: enterEmail,
        phone: enterNumber,
        country: enterCountry,
        city: enterCity,
        postal_code: postalCode,
      },
    }),
  }
);
    const { sessionId } = await res.json();
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <form className="checkout__form" onSubmit={handleSubmit}>
      <div className="form__group">
        <input
          type="text"
          placeholder="Enter your name"
          required
          onChange={(e) => setEnterName(e.target.value)}
        />
      </div>
      <div className="form__group">
        <input
          type="text"
          placeholder="Enter your phone number"
          required
          onChange={(e) => setEnterNumber(e.target.value)}
        />
      </div>
      <div className="form__group">
        <input
          type="text"
          placeholder="Enter your country"
          required
          onChange={(e) => setEnterCountry(e.target.value)}
        />
      </div>
      <div className="form__group">
        <input
          type="text"
          placeholder="Enter your city"
          required
          onChange={(e) => setEnterCity(e.target.value)}
        />
      </div>
      <div className="form__group">
        <input
          type="text"
          placeholder="Enter your postal code"
          required
          onChange={(e) => setPostalCode(e.target.value)}
        />
      </div>
       <div className="form__group">
       <input
         type="email"
         placeholder="Enter your email"
         required
         onChange={(e) => setEnterEmail(e.target.value)}
       /></div>
      <div className="form__group">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {/* 1.10 Người dùng ấn vào nút pay */}
      <button type="submit" className="addTOCart__btn" disabled={loading || !stripe}>
        {loading ? "Processing…" : `Pay $${(total + shippingCost).toFixed(2)}`}
      </button>
    </form>
  );
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const shippingCost = 30;

  useEffect(() => {
    fetch("http://localhost:8000/api/cart")
      .then((r) => r.json())
      .then(setCartItems);
  }, []);

  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />
      <section>
        <Container>
          <Row>
            <Col lg="8" md="6">
              <Elements stripe={stripePromise}>
                <CheckoutForm cartItems={cartItems} shippingCost={shippingCost} />
              </Elements>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;