require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/db');
const bodyParser = require('body-parser');
const path = require('path');

// APIS ///
const ventasAPI = require('./routes/ventas.api');

// Database conection
mongoose.connect(process.env.DB_URI || config.database.uri, config.database.opts);

mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});

mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

// settings
app.set('port', process.env.PORT || 3000);

// middlewares
if (process.env.PROD_CORS) {
    app.use(cors()); // prod
} else {
    app.use(cors({ // dev
        origin: [
            "http://localhost:4200"
        ], credentials: true
    }));
}

app.use(bodyParser.json());

//set static folder (angular compile project)
app.use(express.static(path.join(__dirname, 'ngViews/dist/ngViews'))); // todo

// routes
app.use('/ventasAPI', ventasAPI);

// redirect to index.html on deep links angular
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'ngViews/dist/ngViews/index.html')); // todo
});

// server
app.listen(app.get('port'), () => {
    console.log('Server on port: ' + app.get('port'));
}); 
