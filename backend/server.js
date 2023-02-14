const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//middleware to handle form data
app.use(express.urlencoded({ extended: false }));

//middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

// route handlers
app.get('/hello(.html)?', (req, res, next) => {
	console.log('attempted to load hello.html');
	next();
}, (req, res) => {
	res.send('Hello world');
})

// chaining route handlers
const one = (req, res, next) => {
	console.log('one');
	next();
}

const two = (req, res, next) => {
	console.log('two');
	next();
}

const three = (req, res) => {
	console.log('three');
	res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three]);

app.all('*', (req, res) => {
	res.status(404)
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ error: '404 Not Found' });
	} else {
		res.type('txt').send('404 Not Found');
	}

});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));