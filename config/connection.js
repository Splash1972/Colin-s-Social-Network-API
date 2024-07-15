const { connect, connection } = require('mongoose');

connect(process.env.MONGODB_URI);

module.exports = connection;