/**
 * Converts Card data from database to object which we can then
 * convert to a json object to work with or add other functions
 * @author Heath Dyer (hadyer)
 */

module.exports = class Card {
    id = null;
    name = null;
    description = null;
    show = null;
    level = null;
    hp = null;
    power = null;
    /** Might not use this */
    // moves = [];

    constructor(data) {
        this.id = data.crd_id;
        this.name = data.crd_name;
        this.description = data.crd_description;
        this.show = data.crd_show;
        this.level = data.crd_level;
        this.hp = data.crd_hp;
        this.power = data.crd_power;
    }

    /** Might not use this */
    addMove(move) {
        this.moves.push(move);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            show: this.show,
            level: this.level,
            hp: this.hp,
            power: this.power,
            /** Might not use this */
            moves: this.moves,
        }
    }
};