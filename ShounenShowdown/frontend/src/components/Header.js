import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            {/* Website Title */}
            <div className="title-container">
                <Link to="/home">
                    <span className="title">Shounen Showdown</span>
                </Link>
                <img src="images/icons/battle.png" className="title-icon" alt="Logo Image"></img>
            </div>
        </header>
    );
};

export default Header;