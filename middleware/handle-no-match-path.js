function handleNoMatchPath(req, res) {
    console.log("THIS REQUEST DIDN'T MATCH ...");
    console.log({
        url: req.url,
        params: req.params,
        query: req.query,
    });

    res.send("no match :(");
}
module.exports = {
	handleNoMatchPath,
};