exports.PORT = process.env.PORT;

exports.JWT_SECRET = process.env.JWT_SECRET || 'e5+f6-fo7bc$)5$yt!6!aecl=vybu6vej1rf9h0bh-58kr9%*^';
exports.JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY || '24h';

exports.LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const createMongoURL = () => {
  let mongoDbUrl = `mongodb://`;

  // check for username and password.
  if (process.env.DB_USERNAME && process.env.DB_PASSWORD){
    mongoDbUrl += `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@`;
  }
  //add host and db name.
  mongoDbUrl += `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME || 'expense-tracker'}`;
  return mongoDbUrl
}

exports.MONGO_DB_URL = createMongoURL();