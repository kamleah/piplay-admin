// GameTypeRadioGroup.js
import React from 'react';
import "../css/style.css";

const GameTypeRadioGroup = ({ register }) => {
    return (
        <div className="input-group">
            <div className="game-type-radio-group">
                <input type="radio" id="all" name="gameType" value="all" />
                <label htmlFor="all">All</label>

                <input type="radio" id="padal" name="gameType" value="padal" />
                <label htmlFor="padal">Padal</label>

                <input type="radio" id="pickleball" name="gameType" value="pickleball" />
                <label htmlFor="pickleball">Pickleball</label>
            </div>

        </div>
    );
};

export default GameTypeRadioGroup;
