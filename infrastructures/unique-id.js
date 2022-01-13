const uuidV4 = require('uuid/v4');

class UniqueId {

  static generate() {
    return uuidV4();
  }
}

module.exports = UniqueId;