const Options = require('shiftby-config');

let options;

module.exports = {
  initialize: async (fileOptions) => {
    options = new Options(fileOptions);

    await options.initialize();
  },
  get: (option) => options.get(option),
}
