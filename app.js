const dgram = require("dgram");
const readline = require("readline");

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = function readConfigFile(filePath) {
  var dataArq;
  fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
    if (!err) {
      dataArq = data;
    } else {
      console.log(err);
    }
  });

  return dataArq;
};

function sendMessage(message, HOST, PORT) {
  console.log(message);
  const client = dgram.createSocket("udp4");
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log("UDP " + message + " sent to " + HOST + ":" + PORT);
    client.close();
  });
}

function generateToken() {
  return "1234";
}

function listMessagesQueue() {
  console.log("messages");
}

function help() {
  return (
    "\nComandos:\n" +
    "A -- Ajuda\n" +
    "D -- Destrói um token\n" +
    "E [message] [host] [port] -- Envia [mensagem] para [destino]\n" +
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
    } else if (answer.split(" ").length == 4) {
      const array = answer.split(" ");
      sendMessage(array[1], array[2], array[3]);
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
    } else {
      console.log("Opção inválida! Tente novamente");
      menu();
    }
  });
}

menu();
