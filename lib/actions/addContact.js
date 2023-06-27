const { transform } = require("@openintegrationhub/ferryman");
const { getMetadata } = require("../utils/helpers");
const _ = require("lodash");
const ApiClient = require("../apiClient");

async function processAction(msg, cfg) {
  const self = this;
  self.logger.info('Action addContact started');
  const instance = new ApiClient(cfg, self);
  async function addContact(postRequestBody, meta) {
    self.logger.info('Going to add contact')
    const actionUrl = "/me/contacts";
    return instance.post(actionUrl, postRequestBody);
  }
  function emitData(data) {
    const messageBody = _.omitBy(data, (value, key) =>
      key.startsWith("@odata.")
    );
    self.emit("data", messageBody);
    self.logger.info('Contact was added');
  }
  const transformedData = transform(msg.data, cfg);
  const result = await addContact(transformedData, msg.metadata);
  if (result.error){
    self.logger.error('Execution failed with code: %s, message: %s', result.error.code, result.error.message);
    throw { name: result.error.code, message: result.error.message };
  } else {
    const metadata = getMetadata(msg.metadata);
    emitData({data: result, metadata});
    self.logger.info('Action successfully executed');
  }
}

module.exports.process = processAction;
