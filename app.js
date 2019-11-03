const dgram = require("dgram");
const readline = require("readline");
const fs = require("fs"),
  path = require("path"),
  filePathFileConfig = path.join(__dirname, "config_1.txt");

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

module.exports = function sendMessage(message, PORT, HOST) {
  const client = dgram.createSocket("udp4");
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log("UDP " + message + " sent to " + HOST + ":" + PORT);
    client.close();
  });
};

module.exports = function generateToken() {
  return "1234";
};

function help() {
  return (
    "\nComandos:\n" +
    "A -- Ajuda\n" +
    "D -- Destrói um token\n" +
    "E [destino] [mensagem] -- Envia [mensagem] para [destino]\n" +
    "G -- Gera um token\n" +
    "L -- Verifica mensagens na fila para envio\n" +
    "S -- Sair\n"
  );
}

function menu() {
  r1.question(help(), answer => {
    console.log("Sua resposta", answer);

    switch (answer) {
      case "A":
        console.log(help());
        menu();
        break;
      case "D":
        console.log("dahdau");
        menu();
        break;
      case "E":
        console.log("tesdaygda");
        menu();
        break;
      case "G":
        console.log("djihusd");
        break;
      case "L":
        console.log("bdsbdhsbydshb");
        menu();
        break;
      case "S":
        console.log("bye bye!");
        r1.close();
        return answer;
      default:
        console.log("Opção inválida! Tente novamente");
        menu();
        break;
    }
  });
}

menu();
