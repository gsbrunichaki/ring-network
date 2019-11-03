const dgram = require("dgram");
const fs = require("fs"),
  path = require("path"),
  filePathConfig = path.join(__dirname, "config_1.txt");
const server = dgram.createSocket("udp4");

const queueMessage = [];
const PORT = "41234";
const app = require("app");

server.on("error", err => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

//receive package
server.on("message", (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const typePackage = msg.split(";");
  if (typePackage[0] == "2345") {
    const dataPackage = typePackage[1].split(":");
    if (dataPackage[2] != "Bob") {
      const data = app.readConfigFile(filePathConfig);
      console.log(data);
    }
  }
});

//listening package
server.on("listening", () => {
  ///logic aqui dentro
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(PORT);
