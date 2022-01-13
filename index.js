var express         = require("express"),
app             = express(),
mongoose        = require("mongoose"),
BlockModel      = require("./models/block"),
bodyParser      = require("body-parser"),
moment          = require('moment');


const Blockchain = require("./blockchain_algorithm/blockchain.js");
const Block = require("./blockchain_algorithm/block.js");

var myChain = new Blockchain();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
const port = process.env.PORT || 443
app.get("/", function(req, res) {
  BlockModel.find({},function(err, allBlocks) {
    if(err){
      console.log(err);
    } else {
      myChain = new Blockchain(allBlocks);
      res.render("landing" , {blockchain:myChain, valid:myChain.isValid(), moment:moment})
    }
  });
})

app.get("/new", function(req, res) {
  var lastBlock = myChain.getLatestBlock();
  var newBlock = new Block(0, Date.now(), {}, 0);
  if (lastBlock !== 0) {
      var newBlock = new Block(lastBlock.index + 1, Date.now(), {}, lastBlock.hash);
  }

  console.log(newBlock);
  res.render("new", {newBlock:newBlock, key: newBlock.key, length: newBlock.length});
})


app.post("/new", function(req, res) {
  BlockModel.find({},function(err, allBlocks) {
    if(err){
      console.log(err);
    } else {
      myChain = new Blockchain(allBlocks);
      var lastBlock = myChain.getLatestBlock();

      var data = {message: req.body.message, to: req.body.to, from:req.body.from}

      var index = req.body.index;
      var timestamp = req.body.timestamp
      var hash = req.body.hash
      var prevHash = req.body.prevHash
      var salt = req.body.salt
      var newBlock = new Block(index, timestamp, data, prevHash, hash, salt);
      console.log(newBlock);
      if (lastBlock !== 0) {
        if(index  != (lastBlock.index + 1)) {
          res.send("Failed to add block, index not in order")
          return
        }
      }
      if(hash !== newBlock.calculateHash()){
        res.send("Failed to add block hash value not correct")
        return
      }

      myChain.addBlock(newBlock);
      if(!myChain.isValid()) {
        console.log(newBlock);
        console.log(lastBlock);
        res.send("Failed to add block chain will become invalid")
        return
      }

      console.log(newBlock);
      BlockModel.create(newBlock, function(err, newlyCreated){
        if(err){
          console.log(err);
        } else {
          res.redirect("/index.html");
        }
      });
    }
  });
})
app.listen(port,process.env.IP,function(){
  console.log("Blockchain server is up...");
}); 
const EnvironmentVariables = require('./infrastructures/environment-variables');
const ExpressWebServer = require('./infrastructures/express-server');
const JsonWebToken = require('./infrastructures/json-web-token');
const MongoDb = require('./infrastructures/mongodb');
const UniqueId = require('./infrastructures/unique-id');

const AuthenticationInterface = require('./interfaces/authentication');
const ConfigurationInterface = require('./interfaces/configuration');
const DatabaseInterface = require('./interfaces/database');
const WebServerInterface = require('./interfaces/webserver');

const ConfigurationInteractor = require('./usecases/configuration');
const VersionInteractor = require('./usecases/version');
const UserInteractor = require('./usecases/user');

const environmentVariable = new EnvironmentVariables();
const configurationInterface = new ConfigurationInterface({
  ConfigurationAdapter: environmentVariable,
});

const configurationInteractor = new ConfigurationInteractor({
  ConfigurationInterface: configurationInterface,
});

const configuraionData = configurationInteractor.load();

console.log(configuraionData.toString());

const authenticationInterface = new AuthenticationInterface({
  UniqueIdAdapter: UniqueId,
  WebTokenAdapter: JsonWebToken,
});

const databaseInterface = new DatabaseInterface({
  DatabaseAdapter: MongoDb,
});

const userInteractor = new UserInteractor({
  ConfigurationData: configuraionData,
  AuthenticationInterface: authenticationInterface,
  DatabaseInterface: databaseInterface,
});

const output = userInteractor.createNewEmailUser({
  Email: 'admin@email.dubito.repl.co',
  Password: 'toor',
});

console.log(JSON.stringify(output, null, 2));

const versionInteractor = new VersionInteractor();
const webserverInterface = new WebServerInterface({
  VersionInteractor: versionInteractor,
});

const expressWebServer = new ExpressWebServer({
  WebServerInterface: webserverInterface,
});