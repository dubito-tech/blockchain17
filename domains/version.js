class Version {

  
  static toString() {
   
    const output = {
      version: '1.0.0',
    };

    return JSON.stringify(output, null, 2);
  }
}

module.exports = Version;
