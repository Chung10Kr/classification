/*
 * Main
 * @date 2019-05-07
 * @author LCY
 */

var main = function(req, res) {
  res.render('main.ejs', {param:req});
};

var result = function(req, res) {
  res.render('result.ejs', {param:req});
};

module.exports.main = main;
module.exports.result = result;


