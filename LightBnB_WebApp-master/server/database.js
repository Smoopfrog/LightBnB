const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return null
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return [];
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((res) => {
      if (res.rows.length === 0) {
        return null
      }
      return res.rows[0];
    })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *` , [user.name, user.email, user.password])
    .then(res => {
      return res.rows;
    })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query (`SELECT reservations.*, properties.*, cost_per_night, reservations.start_date, avg(rating) as average_rating
    FROM properties
    JOIN reservations ON reservations.property_id = properties.id
    JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id, properties.cost_per_night
    ORDER BY start_date
    LIMIT $2`, [guest_id, limit])
    .then(res => {
      return res.rows;
    })
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1 = 1
  `;

  // City filter
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }

  // Owner filter
  if (options.owner_id) {
    queryParams.push(`%${options.owner_id}%`);
    queryString += ` AND owner_id LIKE $${queryParams.length}`;
  }

  // //  Maximum cost filter
  if (options.maximum_price_per_night) {
    let max = Number(options.maximum_price_per_night)
    queryParams.push(max * 100);
    queryString += ` AND cost_per_night < $${queryParams.length}`;
  }

  // Min cost filter
  if (options.minimum_price_per_night) {
    let min = Number(options.minimum_price_per_night)
    queryParams.push(min * 100);
    queryString += ` AND cost_per_night > $${queryParams.length}`
  }

  // Add GROUP BY
  queryString += `
  GROUP BY properties.id
  `;

  // Ratings filter
  if (options.minimum_rating) {
    let minRating = Number(options.minimum_rating)
    queryParams.push(minRating);
    queryString += `HAVING avg(rating) > $${queryParams.length}`
  }


  // Add ORDER BY and LIMIT
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;

  return pool.query(queryString, queryParams)
    .then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
