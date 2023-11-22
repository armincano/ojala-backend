const checkPoolConnection = (pool) => {
    pool.on('connect', () => {
        // console.log('connected to the db');
    })
};

module.exports = {
	checkPoolConnection,
};