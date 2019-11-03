const dgram = require("dgram");
const fs = require("fs"),
  path = require("path"),
  filePathConfig = path.join(__dirname, "config_1.txt");
const server = dgram.createSocket("udp4");
const app = require("./app");
const queueMessage = [];
const PORT = "41234";

const dataConfigFile = readConfigFile(filePathConfig).toString.split("/n");

const configFile = {
  ip_destino_porta: dataConfigFile[0],
  apelido_maquina_atual: dataConfigFile[1],
  tempo_token: dataConfigFile[2],
  isToken: dataConfigFile[3]
};

function readConfigFile(filePath) {
  fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
    if (!err) {
      return data;
    } else {
      console.log(err);
    }
  });
}

function sendMessage(message, HOST) {
  const host_port = HOST.split(":");
  const client = dgram.createSocket("udp4");
  client.send(message, 0, message.length, host_port[1], host_port[0], function(
    err,
    bytes
  ) {
    if (err) throw err;
    console.log(
      "UDP " + message + " sent to " + host_port[0] + ":" + host_port[1]
    );
    client.close();
  });
}

server.on("error", err => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

//receive package
server.on("message", async (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  console.log(configFile);
  const typePackage = msg.toString().split(";");
  if (typePackage[0] == "2345") {
    const dataPackage = typePackage[1].split(":");
    const message = {
      controle_de_erro: dataPackage[0],
      apelido_de_origem: dataPackage[1],
      apelido_de_destino: dataPackage[2],
      CRC: dataPackage[3],
      mensagem: dataPackage[4]
    };
    console.log(message);
    if (message.apelido_de_destino != configFile.apelido_maquina_atual) {
      sendMessage(msg, configFile.ip_destino_porta);
    } else if (message.apelido_de_destino == configFile.apelido_maquina_atual) {
    } else if (message.apelido_de_origem == configFile.apelido_maquina_atual) {
    }
  } else if (typePackage[0] == "1234") {
  }
});

//listening package
server.on("listening", () => {
  ///logic aqui dentro
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(PORT);
