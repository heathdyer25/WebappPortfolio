import React from 'react';

const ClassInfo = () => {
  return (
    <>
      <h2 className="title">Character Categories</h2>

      {/* Mystic Category */}
      <div className="category row">
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Mystic.png" alt="Mystic" />
          Mystic
        </div>
        <p>
          Mystics wield supernatural powers, including magic, psychic abilities, or cursed energy. Their strength comes from manipulating forces beyond ordinary physical limits, such as casting spells or distorting space itself.
        </p>
      </div>

      {/* Mobility Category */}
      <div className="category row">
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Mobility.png" alt="Mobility" />
          Mobility
        </div>
        <p>
          Mobility fighters specialize in agility, evasion, and quick strikes. Their gameplay revolves around dodging attacks, outmaneuvering opponents, and delivering fast, successive blows, rather than relying on brute force.
        </p>
      </div>

      {/* Brawler Category */}
      <div className="category row">
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Brawler.png" alt="Brawler" />
          Brawler
        </div>
        <p>
          Brawlers focus on raw physical strength and close-quarters combat. Known for their heavy-hitting moves and exceptional durability, they thrive in battles where they can absorb damage and deal powerful, direct blows.
        </p>
      </div>

      {/* Energy Category */}
      <div className="category row">
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Energy.png" alt="Energy" />
          Energy
        </div>
        <p>
          Energy fighters channel and project various forms of elemental power, such as ki blasts or fire. They excel in ranged combat, using area-of-effect attacks and explosive energy to strike from a distance.
        </p>
      </div>

      <h2 className="title">Type Interactions</h2>

      {/* Interaction 1 */}
      <div className="row gap">
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Mystic.png" alt="Mystic" />
          Mystic
        </div>
        <h1>&gt;</h1>
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Energy.png" alt="Energy" />
          Energy
        </div>
        <p>
          Mystics have the ability to manipulate or redirect the attacks of Energy users, rendering their projectiles ineffective.
        </p>
      </div>

      {/* Interaction 2 */}
      <div className="row gap">
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Energy.png" alt="Energy" />
          Energy
        </div>
        <h1>&gt;</h1>
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Mobility.png" alt="Mobility" />
          Mobility
        </div>
        <p>
          Energy attacks can cover wide areas or have delayed effects, making them difficult for fast-moving opponents to avoid.
        </p>
      </div>

      {/* Interaction 3 */}
      <div className="row gap">
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Mobility.png" alt="Mobility" />
          Mobility
        </div>
        <h1>&gt;</h1>
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Brawler.png" alt="Brawler" />
          Brawler
        </div>
        <p>
          Agile Mobility fighters can outmaneuver the slower Brawlers, landing quick hits while dodging their attacks.
        </p>
      </div>

      {/* Interaction 4 */}
      <div className="row gap">
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Brawler.png" alt="Brawler" />
          Brawler
        </div>
        <h1>&gt;</h1>
        <div className="move-class tag">
          <img className="icon" src="/images/icons/Mystic.png" alt="Mystic" />
          Mystic
        </div>
        <p>
          Brawlers can close the distance and disrupt the concentration needed for Mystic powers, forcing them into a close-quarters fight where their abilities are less effective.
        </p>
      </div>
    </>
  );
};

export default ClassInfo;
