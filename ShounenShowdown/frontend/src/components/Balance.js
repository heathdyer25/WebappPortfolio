import React from 'react';
import { useAuth } from "../contexts/AuthContext";


const Balance = () => {
    const { user } = useAuth();
    
    return (
        <div className="coin-container">
            <span className="balance">{user.balance}</span>
            <img className="coin-img" src="images/icons/coin.svg" alt="coin" />
        </div>
    );
};

export default Balance;