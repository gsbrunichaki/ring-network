const dgram = require("dgram");
const fs = require("fs"),
  path = require("path"),
  filePathConfig = path.join(__dirname, "config_2.txt");
const crc16 = require("js-crc").crc16;
const DataPackage = require("./dataPackage");
const server = dgram.createSocket("udp4");
const statePackage = require("./statePackage");
let configFile = {};
const readline = require("readline");
const PORT = "41234";
const queueMessage = [];
const Config = require("./config");

//lê arquivo de configuração
function readConfigFile(fileName) {
  const content = fs.readFileSync(fileName, "utf8");
  const [destiny, nickname, tokenTime, hasToken] = content.trim().split("\n");
  const [destinyIP, destinyPort] = destiny.split(":");

  return {
    destinyIP,
    destinyPort,
    nickname,
    tokenTime: JSON.parse(tokenTime),
    hasToken: JSON.parse(hasToken)
  };
}

const config = new Config({ ...readConfigFile });
console.log(config.toString());

var dataConfigFile;

//cria scanner de console
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.readFile(filePathConfig, { encoding: "utf-8" }, function(err, data) {
  if (!err) {
    dataConfigFile = data.toString().split("\n");
  } else {
    console.log(err);
  }
});

//envia mensagem para fila
function sendMessageQueue(message, nickNameDestino, port, HOST) {
  queueMessage.push({
    nickNameDestino,
    port,
    message,
    host: HOST
  });
}

//gera token
async function generateToken() {
  configFile = {
    ip_destino_porta: dataConfigFile[0],
    apelido_maquina_atual: dataConfigFile[1],
    tempo_token: dataConfigFile[2],
    isToken: dataConfigFile[3]
  };
  sendMessage("1234", configFile.ip_destino_porta);
}

//lista mensagens na fila
function listMessagesQueue() {
  for (let i = 0; i < queueMessage.length; i++) {
    console.log("\n", queueMessage);
  }
}

//função de ajuda
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

//menu da aplicação
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

//função de envio de mensagem
function sendMessage(message, HOST) {
  const host_port = HOST.split(":");
  const client = dgram.createSocket("udp4");
  console.log(HOST);
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

//executa servvidor
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
    //verifica se o tipo de pacote é de dados
    if (typePackage[0] == "2345") {
      const dataPackage = typePackage[1].split(":");
      const message = {
        controle_de_erro: dataPackage[0],
        apelido_de_origem: dataPackage[1],
        apelido_de_destino: dataPackage[2],
        CRC: dataPackage[3],
        mensagem: dataPackage[4]
      };

      if (message.apelido_de_destino != configFile.apelido_maquina_atual) {
        sendMessage(msg, configFile.ip_destino_porta);
      } else if (
        message.apelido_de_destino == configFile.apelido_maquina_atual
      ) {
        //calcular crc
        let isValidCRC = crc16(message.mensagem) == message.CRC;
        let returnMessage;
        if (isValidCRC) {
          console.log(
            "Apelido da Origem:",
            message.apelido_de_origem,
            " Mensagem:",
            message.mensagem
          );
          returnMessage = `2345;ACK:${message.apelido_de_origem}:${message.apelido_de_origem}:${message.CRC}:${message.mensagem}`;
        } else {
          returnMessage = `2345;erro:${message.apelido_de_origem}:${message.apelido_de_origem}:${message.CRC}:${message.mensagem}`;
        }
        sendMessage(returnMessage, configFile.ip_destino_porta);
      } else if (
        message.apelido_de_origem == configFile.apelido_maquina_atual
      ) {
        //VERIFICAR CONTROLE DE ERRO
        if (
          message.controle_de_erro == statePackage.naoCopiado ||
          message.controle_de_erro == statePackage.ACK
        ) {
          sendMessage("1234", configFile.ip_destino_porta);
        } else {
          let crcMessage = crc16(queueMessage[0].message);
          var msgQueue = `2345;naocopiado:${configFile.apelido_maquina_atual}:${queueMessage[0].nickNameDestino}:${crcMessage}:${queueMessage[0].message}`;
          sendMessage(msgQueue, configFile.ip_destino_porta);
          //TODO ver se passou mais de uma vez
        }
      }
    } else if (typePackage[0] == "1234") {
      //queue
      //Verificar o tempo
      console.log(queueMessage);
      if (queueMessage.length != 0) {
        var msgQueue = `2345;naocopiado:${configFile.apelido_maquina_atual}:${queueMessage[0].nickNameDestino}:19385749:${queueMessage[0].message}`;
        sendMessage(msgQueue, configFile.ip_destino_porta);
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
