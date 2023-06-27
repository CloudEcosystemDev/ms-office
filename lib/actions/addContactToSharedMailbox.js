const { transform } = require("@openintegrationhub/ferryman");
const { getMetadata } = require("../utils/helpers");
const _ = require("lodash");
const ApiClient = require("../apiClient");

async function processAction(msg, cfg) {
  const self = this;
  self.logger.info("Started creating a new contact in a shared mail box");
  const instance = new ApiClient(cfg, self);

  async function addContactToSharedMailbox(postRequestBody, userId, meta) {
    self.logger.info("Calling to Microsoft API in this %s mailbox, request body: %j", userId, postRequestBody);
    const actionUrl = `/users/${userId}/contacts`;
    return instance.post(actionUrl, postRequestBody);
  }

  function emitData(data) {
    const messageBody = _.omitBy(data, (value, key) =>
      key.startsWith("@odata.")
    );

    self.emit("data", messageBody);
  }

  const transformedData = transform(msg.data, cfg);
  const mailbox = msg.data?.mailboxId;
  self.logger.info("Mailbox provided: %j", mailbox);

  if (!mailbox) {
    throw { name: "MailboxError", message: "Shared Mailbox not provided" };
  }
  delete msg.data?.mailboxId;
  let result;
  try {
     result = await addContactToSharedMailbox(
      transformedData,
      mailbox,
      msg.metadata
    );
    self.logger.info("Result of the api call: %j", result);
  } catch (error) {
    self.logger.info("Error in the call to Microsoft API. Error: %j", error);
    self.logger.error("Error calling Microsoft API. Error: %j", error);
    throw error;
  }
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
