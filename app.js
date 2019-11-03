const dgram = require("dgram");
const fs = require("fs"),
  path = require("path"),
  filePathConfig = path.join(__dirname, "config_1.txt");
const server = dgram.createSocket("udp4");
const statePackage = require("./statePackage");
let configFile = {};
const readline = require("readline");
const PORT = "41234";
const queueMessage = [{}];

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var dataConfigFile = readConfigFile(filePathConfig);

function readConfigFile(filePath) {
  fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
    if (!err) {
      return data;
    } else {
      console.log(err);
    }
  });
}

function sendMessageQueue(message, nickNameDestino, port, HOST) {
  queueMessage.push({
    nickNameDestino,
    port,
    message,
    host: HOST
  });
}

function generateToken() {
  configFile = {
    ip_destino_porta: dataConfigFile[0],
    apelido_maquina_atual: dataConfigFile[1],
    tempo_token: dataConfigFile[2],
    isToken: dataConfigFile[3]
  };
  sendMessage("1234", configFile.ip_destino_porta);
}

function listMessagesQueue() {
  for (let i = 0; i < queueMessage.length; i++) {
    console.log("\n", queueMessage);
  }
}

function help() {
  return (
    "\nComandos:\n" +
    "RUN -- iniciar Server\n" +
    "A -- Ajuda\n" +
    "D -- Destrói um token\n" +
    "E [message] [apelido destino] [porta] [host] -- Envia [mensagem] para [destino]\n" +
    "G -- Gera um token\n" +
    "L -- Verifica mensagens na fila para envio\n" +
    "S -- Sair\n"
  );
}

function menu() {
  r1.question(help(), answer => {
    if (answer == "A") {
      console.log(help());
      menu();
    } else if (answer == "D") {
      console.log("dahdau");
      menu();
    } else if (answer.split(" ").length == 5) {
      const array = answer.split(" ");
      sendMessageQueue(array[1], array[2], array[3], array[4]);
      menu();
    } else if (answer == "G") {
      generateToken();
      menu();
    } else if (answer == "L") {
      listMessagesQueue();
      menu();
    } else if (answer == "S") {
      console.log("bye bye!");
      r1.close();
    } else if (answer == "RUN") {
      runServer();
      menu();
    } else {
      console.log("Opção inválida! Tente novamente");
      menu();
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

function runServer() {
  server.on("error", err => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

  //receive package
  server.on("message", async (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

    configFile = {
      ip_destino_porta: dataConfigFile[0],
      apelido_maquina_atual: dataConfigFile[1],
      tempo_token: dataConfigFile[2],
      isToken: dataConfigFile[3]
    };

    const typePackage = msg.toString().split(";");
    const dataPackage = typePackage[1].split(":");
    const message = {
      controle_de_erro: dataPackage[0],
      apelido_de_origem: dataPackage[1],
      apelido_de_destino: dataPackage[2],
      CRC: dataPackage[3],
      mensagem: dataPackage[4]
    };
    if (typePackage[0] == "2345") {
      if (message.apelido_de_destino != configFile.apelido_maquina_atual) {
        //calcular crc
        sendMessage(msg, configFile.ip_destino_porta);
      } else if (
        message.apelido_de_destino == configFile.apelido_maquina_atual
      ) {
      } else if (
        message.apelido_de_origem == configFile.apelido_maquina_atual
      ) {
        //VERIFICAR CONTROLE DE ERRO
        if (
          message.controle_de_erro == statePackage.naoCopiado ||
          message.controle_de_erro == statePackage.erro
        ) {
          //gerar token
          sendMessage("1234", configFile.ip_destino_porta);
        }
      }
    } else if (typePackage[0] == "1234") {
      //queue
      if (queueMessage != undefined) {
        var msgQueue = `2345;naocopiado:${configFile.apelido_maquina_atual}:${queueMessage[0].nickNameDestino}:19385749:${queueMessage[0].message}`;
        var hostQueue = `${queueMessage[0].host}:${queueMessage[0].port}`;
        sendMessage(msgQueue, hostQueue);
      } else {
        sendMessage("1234", configFile.ip_destino_porta);
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
}

menu();
