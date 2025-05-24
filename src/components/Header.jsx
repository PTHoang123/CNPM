import React from 'react'
import {Container} from "reactstrap"
import logo from '../assets/images/res-logo.png'
import { NavLink, Link } from 'react-router-dom'
import "../styles/header.css"

const navLinks = [
    {
        display: "Home",
        path: "/"
    },
    {
        display: "Foods",
        path: "/food"
    }
    ,
    {
        display: "Cart",
        path: "/cart"
    },
    {
        display: "Checkout",
        path: "/checkout"
    }

]


function Header() {
  return (
    <header className="header">
        <Container>
            <div className="nav__wrapper d-flex align-items-center justify-content-between">
                <div className="logo">
                    <img src={logo} alt="logo" />
                    <h5>Foodyfi</h5>
                </div>
                <div className="navigation ">
                    <div className="menu d-flex align-items-center gap-5">
                        {
                            navLinks.map((item, index) => (
                                <NavLink to={item.path} className="menu__item text-decoration-none" key={index}>
                                    {item.display}
                                </NavLink>
                            ))
                        }
                    </div>
                </div>
                <div className="nav__right d-flex align-items-center gap-3">
                    <span className="cart__icon">
                        <i className="ri-shopping-cart-fill"></i>
                        <span className="cart__badge">1</span>
                    </span>
                    <span className="user">
                        <i className="ri-user-fill"></i>
                    </span>
                    <span className="order__icon">
                        <i className="ri-waiting-room-fill"></i>
                    </span>
                </div>
            </div>
        </Container>
    </header>
    )
}

export default Header