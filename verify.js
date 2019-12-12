let jwt = require('jsonwebtoken');
let secretKey = process.env.SECRET_KEY;

exports.getToken = function(user){
	return jwt.sign(user, secretKey, {
		expiresIn: 3600
	});
};

exports.verifyUser = function(req, res, next){
	// check and aquire token from request
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if(token){
		jwt.verify(token, secretKey, function(err, decoded){
			if(err){
				var err = new Error('You are not authenticated!');
				err.status = 401;
				return next(err);
			} else {
				// this will load a new property named decoded to the request object
				req.decoded = decoded; 
				next();
			}
		});
	} else {
		// if there is no token, return an error
		var err = new Error('No token provided!');
		err.status = 403;
		return next(err);
	}
};