class Config {

  constructor(destinyIP, destinyPort, nickname, tokenTime, hasToken) {
    this.destinyIP = destinyIP;
    this.destinyPort = destinyPort;
    this.nickname = nickname;
    this.tokenTime = tokenTime;
    this.hasToken = hasToken;
  }

  getDestinyIP() {
    return this.destinyIP;
  }

  getDestinyPort() {
    return this.destinyPort;
  }

  getNickname() {
    return this.nickname;
  }

  getTokenTime() {
    return this.tokenTime;
  }

  getHasToken() {
    return this.hasToken;
  }

  setHasToken(hasToken) {
    this.hasToken = hasToken;
  }

  toString() {
    console.log(this.destinyIP);
    console.log(this.destinyPort);
    console.log(this.nickname);
    console.log(this.tokenTime);
    console.log(this.hasToken);
  }
}

module.exports = Config;