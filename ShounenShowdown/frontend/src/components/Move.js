import React, { useEffect, useState } from "react";

import CardClient from '../clients/CardClient.js';

const Move = ({ moveId }) => {

const [move, setMove] = useState([]);


useEffect(() => {
    CardClient.getMoveByMoveId(moveId)
      .then(move => {
        setMove(move);
      })
      .catch(error => {
        console.log(error.message);
      })
  }, [moveId]);


  return (
    <div className="move">
        <div className="move-name">{move.name}</div>
        <div className="move-type tag">{move.type}</div>
        <div className="move-className tag">
            <img className="icon" src={`/images/icons/${move.class}.png`}/>
            {move.class}
        </div>
    </div>
    );
};

export default Move;
