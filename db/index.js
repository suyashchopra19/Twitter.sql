
const pg = require('pg');
const dblocation = 'postgres://localhost/twitterdb';
const client = new pg.Client(dblocation);

// connecting to the `postgres` server
client.connect(function(err){
	if(err) throw err;
});

// make the client available as a Node module
module.exports = client;
