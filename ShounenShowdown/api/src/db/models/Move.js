/**
 * Converts Move data from database to object which we can then
 * convert to a json object to work with or add other functions
 * @author Heath Dyer (hadyer)
 */

module.exports = class Move {
    id = null;
    card_id = null;
    name = null;
    description = null;
    type = null;
    class = null;

    constructor(data) {
        this.id = data.mov_id;
        this.card_id = data.mov_crd_id;
        this.name = data.mov_name;
        this.description = data.mov_description;
        this.type = data.mov_type;
        this.class = data.mov_class;
    }

    toJSON() {
        return {
            id: this.id,
            card_id: this.card_id,
            name: this.name,
            description: this.description,
            type: this.type,
            class: this.class,
        }
    }
};
