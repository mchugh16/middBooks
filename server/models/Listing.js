const { Model } = require('objection');

class Listing extends Model {
  static get tableName() {
    return 'Listings';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      // required : [nothing yet]

      properties: {
        listing_id: { type: 'increments' },
        user_id: { type: 'integer' },
        ISBN: { type: 'integer' },
        condition: { type: 'string' },
        price: { type: 'decimal' },
        edited: { type: 'string' },
        comments: { type: 'text' }
      }
    };
  }
}

module.exports = Listing;