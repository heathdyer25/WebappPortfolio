import React, { useState, useEffect, useRef } from "react";
import Card from './Card';
import PackClient from "../clients/PackClient";


const PackOpen = ({packCard}) => {
    const [card, setCard] = useState();


    // const didFetch = useRef(false);

    // useEffect(() => {
    //     if (!didFetch.current) {
    //         didFetch.current = true;

    //         console.log("Fetching card for pack:", packID);
    //         PackClient.getPackCard(packID).then((card) => {
    //             setCard(card);
    //         });
    //     }

    //     return () => {
    //         didFetch.current = false; 
    //         setCard(undefined);       
    //     };
    // }, [packID]);

    // PackClient.getPackCard(packID).then((packCard) => {
    //     setCard(packCard);
    // });

    useEffect(() => {
        setCard(packCard);
    }, [packCard]);
    
    return card ? <Card key={card.id} card={card}/> : <div>Loading...</div>;
};

export default PackOpen;
