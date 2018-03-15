import { Express, Router } from 'express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as mongo from 'mongodb';
import * as http from 'http';
import * as router from '././routes/users';
import * as routerOrder from '././routes/orders';
import * as routerProduct from '././routes/products';
import * as config from '../config/config';
var app = express();

var url = config.MONGO_DB_URL;
var mongoClient =  mongo.MongoClient;
mongoose.connect(url, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDb');
  }
});

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});


app.use('/users', router);
app.use('/orders', routerOrder);
app.use('/products', routerProduct);

var server = http.createServer(app);
server.listen(8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

export default app;