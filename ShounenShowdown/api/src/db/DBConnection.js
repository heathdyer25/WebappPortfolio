const mariadb = require('mariadb');

let pool;

exports.getDatabaseConnection = () => {
  try {
    if(!pool) {
      pool = mariadb.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        charset: process.env.DB_CHARSET
      });
    }
    return pool;
  }
  catch {
    return Promise.reject({code: 502, message: "Could not connect to database"});
  }
};

exports.query = (query, params = []) => {
  const pool = exports.getDatabaseConnection();
  return pool.query(query, params).catch(err => {
    console.log(err);
  });
};

exports.query = (query, params = [], conn = null) => {
  if (conn) {
    return conn.query(query, params);
  }
  const pool = exports.getDatabaseConnection();
  return pool.query(query, params);
};

exports.close = () => {
  if(pool) {
    pool.end();
    pool = null;
  }
};


