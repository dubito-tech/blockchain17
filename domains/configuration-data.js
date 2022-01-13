class ConfigurationData {
  
  get MongoDBUrl() {
    return this.mongoDBUrl;
  }
  set MongoDBUrl(url) {
    this.mongoDBUrl = url;
  }

  get NodeEnv() {
    return this.nodeEnv;
  }
  set NodeEnv(environment) {
    this.nodeEnv = environment;
  }

  get SecretKey() {
    return this.secretKey;
  }
  set SecretKey(key) {
    this.secretKey = key;
  }

  toString() {
    const output = {
      MongoDBUrl: this.mongoDBUrl,
      NodeEnv: this.nodeEnv,
      SecretKey: this.secretKey,
    };

    return JSON.stringify(output, null, 2);
  }
}

module.exports = ConfigurationData;