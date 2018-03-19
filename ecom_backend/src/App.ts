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
import * as controller from '././controllers/products';
import * as contract from 'truffle-contract';
import { CodeConstants } from './interfaces/code_constants';
import * as Web3 from 'web3';

var web3 = new Web3( new Web3.providers.HttpProvider("http://13.250.35.159:9545"));
var LevelUp = contract(CodeConstants.LevelUp);
LevelUp.setProvider(web3.currentProvider);

function setupProductEventListner() {
  let productEvent;
  LevelUp.deployed().then(function(i) {
    productEvent = i.NewProduct({fromBlock: 0, toBlock: 'latest'});

    productEvent.watch(function(err, result) {
      if (err) {
        console.log(err)
        return;
      }
      controller.createProduct(result.args);
    });
  })
}

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
mongoose.set('debug', true);

// parse application/json
app.use(bodyParser.json({limit: '50mb'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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

setupProductEventListner();
export default app;