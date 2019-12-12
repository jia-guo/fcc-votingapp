let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let passport = require('passport');
let path = require('path');
let favicon = require('serve-favicon');

mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect('mongodb://localhost:27017/polls');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error'));
db.once('open', () => console.log('mongodb connected'));

let authenticate = require('./authenticate');
let Verify = require('./verify');
let Polls = require('./models/polls');
let Users = require('./models/users');

let app = express();

app.set('port', (process.env.PORT || 3001));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(passport.initialize());

// render favicon and index.html 
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(favicon(path.join(__dirname, 'client', 'build', 'favicon.ico')));

// get all polls
app.get('/poll', (req, res) => {
	Polls.find({})
		.sort({voteNum: -1})
		.exec((err, polls) => {
		res.json(polls);
	});
});

// create new poll
app.post('/poll', Verify.verifyUser, (req, res) => {
	let newPoll = {
		author: req.body.author,
		topic: req.body.topic,
		options: req.body.options,
		voteNum: req.body.voteNum || 0,
		type: req.body.type || 'public'
	};
	let pollCreated = req.body.pollCreated;
	Polls.create(newPoll, (err, poll) => {
		if(err) {
			console.log(err);
			res.json({message: err.message});
		} else {
			pollCreated.push(poll.id);
			Users.findByIdAndUpdate(req.body.userId, {pollCreated}, (err, user) => {
				if(err){
					console.log(err);
					res.json({message: err.message});
				} else {
					res.json({message: 'poll created', poll});
				}
			});
		}
	});
});

// update a poll for a new vote
app.put('/poll/:id', Verify.verifyUser, (req, res) => {
	let updatedPoll = {
		options: req.body.options,
		voteNum: req.body.voteNum
	};
	Users.findById(req.body.userId, (err, user) => {
		if(err) console.log(err);
		if(user.pollVoted.includes(req.params.id)){
			res.json({message: 'cannot vote again'});
		} 
		let updatedPollVoted = [...user.pollVoted, req.params.id];
		Polls.findByIdAndUpdate(req.params.id, updatedPoll, (err, poll) => {
			if(err) res.json({message: err.message});
			Users.findByIdAndUpdate(req.body.userId, {pollVoted: updatedPollVoted}, (err, user) => {
				if(err) res.json({message: err.message});
				res.json({message: 'poll updated', id: poll.id});
			})
		})
	})
});

// remove poll
app.delete('/poll/:id', Verify.verifyUser, (req, res) => {
	Polls.findByIdAndRemove(req.params.id, (err, poll) => {
		if(err){
			res.json({message: err.message});
		} else {
			let pollCreated = req.body.pollCreated;
			let index = pollCreated.findIndex(pollId => pollId === req.params.id);
			if(index === -1){
				res.json({message: 'poll not created by this user'})
			} else {
				pollCreated = [...pollCreated.slice(0, index), ...pollCreated.slice(index + 1)];
				Users.findByIdAndUpdate(req.body.userId, {pollCreated}, (err, user) => {
					if(err){ 
						res.json({message: err.message});
					} else {
						res.json({message: 'poll removed', id: poll.id});
					}
				});
			}
		}
	});
});

// get all users (development only)
app.get('/users', (req, res) => {
	Users.find({}, (err, users) => {
		res.json(users);
	});
});

// check username
app.get('/users/:username', (req, res) => {
	Users.find({username: req.params.username}, (err, user) => {
		if(user.length){
			res.json({message: 'username exists'});
		} else {
			res.json({message: 'username ok'});
		}
	})
})

// detele user (development only)
// app.delete('/users/:id', (req, res) => {
// 	Users.findByIdAndRemove(req.params.id, (err, user) => {
// 		if(err){
// 			console.log(err);
// 			res.json({message: err.message});
// 		} else {
// 			res.json({status: 'user removed'});
// 		}
// 	});
// });

// create new user (signup)
app.post('/signup', (req, res) => {
	Users.register(new Users({username: req.body.username}),
	req.body.password, (err, user) => {
    	if(err){
    		return res.status(500).json({message: err.message});
    	}
    	user.save((err, user) => {
    		passport.authenticate('local')(req, res, () => (
    			res.status(200).json({message: 'Sign Up Successfully!'})
    		));
    	});
    });
});

// login
app.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if(err){
			return next(err);
		}
		if(!user) {
			return res.status(401).json({
				message: 'Incorrect information'
			})
		}
		req.logIn(user, err => {
			if(err){
				return res.status(500).json({
					message: 'Could not log in user'
				});
			}
			// generate token
			let token = Verify.getToken(user);

			res.status(200).json({
				message: 'Login Successfully',
				success: true,
				token: token,
				user: user
			});
		});
	})(req, res, next);
});

//logout
app.get('/logout', function(req, res){
	req.logout();
	res.status(200).json({
		message: 'Logout Successfully!'
	});
	// should also destroy the token
});

// error handling
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

app.listen(app.get('port'), () => {
	console.log(`app running on port ${app.get('port')}`);
});