exports.index = function (req, res, next) {
	res.render('dataview', {
		title: 'MowPiMap',
		version: '202203',
		s: req.app.locals.s
	});
	//console.log(req.app.locals.s)//werkt
}