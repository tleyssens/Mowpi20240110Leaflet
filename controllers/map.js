//render pagina map.pug in dir views

exports.index = function(req, res, next) {
	res.render('map', { title: 'MowPiMap', version: '65',s: req.app.locals.s}); 
	//console.log(req.app.locals.s)//werkt
}