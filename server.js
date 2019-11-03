const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const HOST = "127.0.0.1";
const PORT = "5000";

server.on("error", err => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

//send package
server.on("message", (msg, rinfo) => {
  console.log(rinfo);
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

//receive package
server.on("listening", () => {
  ///logic aqui dentro
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(PORT, HOST);
