const dgram = require("dgram");
var message = new Buffer("My KungFu is Good!");

const configFile = {
  ip_destino_token: process.env.ip,
  apelido_da_maquina_atual: process.env.apelido,
  tempo_token: process.env.tempo,
  token: process.env.token
};

console.log(configFile);

configFile.ip_destino_token = process.env.ip;
configFile.apelido_da_maquina_atual = process.env.apelido;
configFile.tempo_token = process.env.tempo;
configFile.token = process.env.token;

console.log("config", configFile);

var client = dgram.createSocket("udp4");
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
  if (err) throw err;
  console.log("UDP message sent to " + HOST + ":" + PORT);
  client.close();
});
