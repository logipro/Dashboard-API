var WebSocket = require("ws");

//create the object to export
var wss = {};

//----Webosocket
const wssInstance = new WebSocket.Server({ port: 8069 });
wss.wssInstance = wssInstance;

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.wssInstance.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

var listOfActiveConnections = [];
wss.listOfActiveConnections = listOfActiveConnections;

wss.wssInstance.on("connection", function connection(ws) {
  listOfActiveConnections.push(ws);
  wss.broadcast({ type: "serverMsg", msg: "new client joined" });
});

module.exports = wss;
