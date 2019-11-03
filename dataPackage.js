class DataPackage {
  constructor(errorControl, sourceNickname, destinyNickname, crc, message) {
    this.sequenceNumber = '2345';
    this.errorControl = errorControl;
    this.sourceNickname = sourceNickname;
    this.destinyNickname = destinyNickname;
    this.crc = crc;
    this.message = message;
  }

  getSequenceNumber() {
    return this.sequenceNumber;
  }

  getErrorControl() {
    return this.errorControl;
  }

  getSourceNickname() {
    return this.sourceNickname;
  }

  getDestinyNickname() {
    return this.destinyNickname;
  }

  getCrc() {
    return this.crc;
  }

  getMessage() {
    return this.message;
  }

  toString() {
    return `${this.sequenceNumber};${this.errorControl}:${this.sourceNickname}:${this.destinyNickname}:${this.crc}:${this.message}`;
  }
}

module.exports = DataPackage;