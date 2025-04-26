// HomePage.js (Page)
import React, {useState} from 'react';

import Header from '../components/Header.js';
import '../styles/cards.css';
import BackArrow from '../components/BackArrow.js';
import Balance from '../components/Balance.js';

import Modal from "../components/Modal";
import PackOpen from '../components/PackOpen.js';
import PackClient from '../clients/PackClient.js';

import { useAuth } from '../contexts/AuthContext.js';

const ShopPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [packID, setPackID] = useState(1);
    const [packCard, setPackCard] = useState();

    const {current} = useAuth();
    const [maxCapacity, setMaxCapacity] = useState({ 1: false, 2: false, 3: false, 4: false });

    function openPack(packID) {
      PackClient.getPackCard(packID)
        .then((packCard) => {
          setPackCard(packCard);
          setIsModalOpen(true);
          setMaxCapacity(prev => ({ ...prev, [packID]: false }));
        })
        .catch((error) => {
            if (error.message.includes('404')) {
              setMaxCapacity(prev => ({ ...prev, [packID]: true }));
            } else {
              // Handle other errors differently
              console.error('Unexpected error:', error);
            }
        });
    }    

    return (
      <>
        <Header />
        <main>
            <div> 
                <BackArrow />
                <Balance />
            </div>
            <div className="container shop">
            {/* starter packs */}
              <h2>Starter Packs</h2>
              <div className="packs">
                  {/* pack 1 */}
                  <div className = "pack-container">
                    <div className="pack">
                        <div className="cards">
                            <div className="card">
                                <div className='card-img-wrapper'>
                                    <img className="card-img" src="/images/packs/pack_1-1.jpg" alt="Example card"/>
                                </div>  
                                <div>LVL 1</div>
                            </div>
                            <div className="card">
                                <div className='card-img-wrapper'>
                                    <img className="card-img" src="/images/packs/pack_1-2.jpg" alt="Example card"/>
                                </div>
                                <div>LVL 2</div>
                            </div>
                        </div>
                        <h3>Standard Pack</h3>
                        <p>A solid start! Collect and play</p>
                    </div>
                    <div className="buy-pack">
                        <div className="buy-pack-btn" disabled={maxCapacity[1]} onClick={() => {
                            // setPackID(1);
                            openPack(1);
                        }}>
                            50
                            <img className="icon" src={`/images/icons/coin.svg`}/>
                        </div>
                    </div>
                  </div>
                  {/* pack 2 */}
                  <div className = "pack-container">
                    <div className="pack">
                        <div className="cards">
                            <div className="card">
                                <div className='card-img-wrapper'>
                                    <img className="card-img" src="/images/packs/pack_2-1.jpg" alt="Example card"/>
                                </div>
                                <div>LVL 4</div>
                            </div>
                            <div className="card">
                                <div className='card-img-wrapper'>
                                    <img className="card-img" src="/images/packs/pack_2-2.jpg" alt="Example card"/>
                                </div>
                                <div>LVL 4</div>
                            </div>
                        </div>
                        <h3>Premium Pack</h3>
                        <p>Exclusive & rare cards inside!</p>
                    </div>
                    <div className="buy-pack">
                        <div className="buy-pack-btn" disabled={maxCapacity[2]} onClick={(e) => {
                            // setPackID(2);
                            openPack(2);
                        }}>
                            100
                            <img className="icon" src={`/images/icons/coin.svg`}/>
                        </div>
                    </div>
                  </div>
                  
              </div>
          </div>
          <div className="container shop">
              <h2>Ani-Verse Sets</h2>
              <div className="packs">
                  <div className = "pack-container">
                    <div className="pack">
                        <div className="cards">
                            <div className="card">
                                <div className='card-img-wrapper'>
                                    <img className="card-img" src="/images/packs/pack_3-1.jpg" alt="Example card"/>
                                </div>
                                <div>LVL 3</div>
                            </div>
                            <div className="card">
                                <div className='card-img-wrapper'>
                                    <img className="card-img" src="/images/packs/pack_3-2.jpg" alt="Example card"/>
                                </div>
                                
                                <div>LVL 3</div>
                            </div>
                        </div>
                        <h3>Sage of Six Path Duo</h3>
                    </div>
                    <div className="buy-pack">
                        <div className="buy-pack-btn" disabled={maxCapacity[3]} onClick={() => {
                            // setPackID(3);
                            openPack(3);
                        }}>
                            100
                            <img className="icon" src={`/images/icons/coin.svg`}/>
                        </div>
                    </div>
                  </div>
                  <div className = "pack-container">
                    <div className="pack">
                        <div className="cards">
                            <div className="card">
                                <div className='card-img-wrapper'>
                                    <img className="card-img"src="/images/packs/pack_4.jpg" alt="Example card"/>
                                </div>
                                
                                <div>HxH</div>
                            </div>
                        </div>
                        <h3>Hunter Trials Pack</h3>
                    </div>
                    <div className="buy-pack">
                        <div className="buy-pack-btn" disabled={maxCapacity[4]} onClick={() => {
                            // setPackID(4);
                            openPack(4);
                        }}>
                            100

                            <img className="icon" src={`/images/icons/coin.svg`}/>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                current();
            }}>
                <PackOpen packCard={packCard} />
            </Modal>
        </main>
    </>
  );
}

export default ShopPage;