import React from 'react';
import { Link } from 'react-router-dom';

const BackArrow = () => {
    return (
        <Link to="/" className="go-back">
            <span>&#x2B05;</span>
        </Link>
    );
};

export default BackArrow;