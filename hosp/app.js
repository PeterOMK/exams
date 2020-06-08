const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');



//Using the routes.js files
const things = require('./routes/routes.js');
app.use('/', things);


//App listens on port 3000
app.listen(port, () => {
    console.log("App is running on port " + port);

})