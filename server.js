const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const PORT = "41234";

server.on("error", err => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

//receive package
server.on("message", (msg, rinfo) => {
  console.log(rinfo);
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

//listening package
server.on("listening", () => {
  ///logic aqui dentro
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(PORT);
