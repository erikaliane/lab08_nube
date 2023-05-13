const express = require('express');
const app = express();
var path = require('path');

const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));

app.get('/landingpage', (req, resp) => {
    resp.sendFile(`${__dirname}/views/landingpage.html`)
})


app.use('/',require('./router.js'));

var publicPath = path.resolve(__dirname, 'views');
app.use(express.static(publicPath));
app.listen(PORT)