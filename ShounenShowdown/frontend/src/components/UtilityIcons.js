import React from 'react';
import { Link } from 'react-router-dom';

import Balance from './Balance.js';

const UtilityIcons = () => {
    
    return (
        <div id="util-icons">
            <Balance />
            <Link to="/shop">
                <img src="/images/icons/shop.png" className="icon" alt="Shop Icon" />
            </Link>
            <Link to="/settings">
                <img src="/images/icons/settings.png" className="icon" alt="Settings Icon" />
            </Link>
        </div>
    );
};

export default UtilityIcons;