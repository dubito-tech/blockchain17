const ConfigurationData = require('../domains/configuration-data');

class EnvironmentVariable {

  
  load() {
    
    const configurationData = new ConfigurationData();

    configurationData.MongoDBUrl = process.env.MONGODB_URL || 'localhost';
    configurationData.NodeEnv = process.env.NODE_ENV || 'development';
    configurationData.SecretKey = process.env.SECRET_KEY || 'secret';

    return configurationData;
  }
}

module.exports = EnvironmentVariable;
