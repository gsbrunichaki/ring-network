const dgram = require("dgram");
const readline = require("readline");
const queueMessage = [
  {
    message,
    host
  }
];

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function sendMessage(message, HOST) {
  queueMessage.push({
    message,
    host: HOST
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
    "E [message] [host] -- Envia [mensagem] para [destino]\n" +
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
    } else if (answer.split(" ").length == 3) {
      const array = answer.split(" ");
      sendMessage(array[1], array[2]);
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
