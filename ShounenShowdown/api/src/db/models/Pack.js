/**
 * Converts Pack data from database to object which we can then
 * convert to a json object to work with or add other functions
 * @author Heath Dyer (hadyer)
 */

module.exports = class Pack {
    id = null;
    name = null;
    price = null
    /** Might not use this */
    // cards = [];

    constructor(data) {
        this.id = data.pck_id;
        this.name = data.pck_name;
        this.price = data.pck_price;
    }

    /** Might not use this */
    addCard(card) {
        this.cards.push(card);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price
        }
    }
};