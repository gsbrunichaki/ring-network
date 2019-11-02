const dgram = require("dgram");
var fs = require("fs"),
  path = require("path"),
  filePathFileConfig = path.join(__dirname, "config_1.txt"),
  client = dgram.createSocket("udp4");

function readConfigFile(filePath) {
  var dataArq;
  fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
    if (!err) {
      dataArq = data;
    } else {
      console.log(err);
    }
  });

  return dataArq;
}

function sendMessage(message, PORT, HOST) {
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log("UDP " + message + " sent to " + HOST + ":" + PORT);
    client.close();
  });
}

function generateToken() {
  return "1234";
}

var dataArqConfig = readConfigFile(filePathFileConfig);
