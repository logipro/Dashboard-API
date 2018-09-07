var express = require("express"),
  ejwt = require("express-jwt"),
  jwt = require("jsonwebtoken"),
  passport = require("passport"),
  passportConfig = require("./config/passport"),
  LocalStrategy = require("passport-local").Strategy,
  bodyParser = require("body-parser"),
  app = express(),
  port = process.env.PORT || 3001,
  config = require("./config"),
  WebSocket = require("ws");

//----Webosocket
const wss = new WebSocket.Server({ port: 8069 });
exports.wss = wss;
// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

exports.WSBroadcast = wss.broadcast;
var listOfActiveConnections = [];
exports.listOfActiveConnections = listOfActiveConnections;
wss.on("connection", function connection(ws) {
  listOfActiveConnections.push(ws);
  wss.broadcast({ type: "serverMsg", msg: "new one joined" });
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });
});
//----

// check the address
app.use(function(req, res, next) {
  console.log(req.url);
  next();
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  //intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    //respond with 200
    res.sendStatus(200);
  } else {
    //move on
    next();
  }
});
// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(
  ejwt({
    secret: config.jwt_secret,
    requestProperty: "tokenPayload" /* , credentialsRequired: false */
  }).unless({
    path: ["/login", "/guesttoken"]
  })
);
passportConfig(app, passport);

// Initialize Routes
var securityRoutes = require("./api/routes/securityRoutes");
securityRoutes(app);

//var dashboardRoutes = require("./api/routes/dashboardRoutes");
//dashboardRoutes(app);

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

// Start server
var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log(
    "Dashboard RESTful API server started on http://%s:%s",
    host,
    port
  );
});
