class Authentication {
  constructor(options) {
    this.uniqueIdAdapter = options.UniqueIdAdapter;
    this.webTokenAdapter = options.WebTokenAdapter;
  }

  getNewUserId() {
    return this.uniqueIdAdapter.generate();
  }

  getNewWebToken(options) {
    return this.webTokenAdapter.generate(options);
  }
}

module.exports = Authentication;