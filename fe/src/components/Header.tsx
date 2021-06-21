import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header id='header'>
            <nav className='container'>
                <div>
                    <Link to='/'>ECOMMERCE</Link>
                </div>
                <ul className='u-txt-center'>
                    <li>
                        <Link to="/cart" className='nav-link'>
                            <i className='fas fa-shopping-cart'></i> Cart
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className='nav-link'>
                            <i className='fas fa-user'></i> Login
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;