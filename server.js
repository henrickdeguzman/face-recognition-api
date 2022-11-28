const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE
    }
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    db.select('*').from('users')
        .then(data => {
            res.json(data);
        });
});

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt); });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt); });

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db); });

app.put('/image', (req, res) => { image.handleImage(req, res, db); });

app.post('/imageAPI', (req, res) => { image.handleApiClarify(req, res) });

const envPort = process.env.PORT || 3000;

app.listen(envPort, () => {
    console.log(`Listening to port ${envPort}`)
});