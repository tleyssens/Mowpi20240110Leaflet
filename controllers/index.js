//1_OpstartenServer#6; render pagina index.pug in dir views

exports.index = function(req, res, next) {
    res.render('index', { title: 'MowPi apparte socketfile', version: '100'});
  }