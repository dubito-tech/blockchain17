const jwt = require('jsonwebtoken');

class JsonWebToken {

  static generate(options) {
    const tokenOptionalInfo = {
      algorithm: 'HS256',
      expiresIn: options.expiration,
    };

    return jwt.sign(
      options.tokenPayload,
      options.secret,
      tokenOptionalInfo);
  }
}

module.exports = JsonWebToken;
