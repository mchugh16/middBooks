exports.up = knex => {
  return knex.schema.createTable('Listings', table => {
    table.increments('id').primary();
    table.integer('userID');
    table.string('ISBN');
    table.string('condition');
    table.decimal('price');
    table.string('edited');
    table.text('comments');
    // insert further constraints such as not nullable
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('Listings');
};
