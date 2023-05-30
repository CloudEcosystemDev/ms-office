const logger = require("@openintegrationhub/ferryman/lib/logging");
const { transform } = require("@openintegrationhub/ferryman");
const { getMetadata } = require("../utils/helpers");
const _ = require("lodash");
const ApiClient = require("../apiClient");

async function processAction(msg, cfg) {
  logger.info("Started creating a new contact in a shared mail box");
  const self = this;

  const instance = new ApiClient(cfg, self);

  async function addContactToSharedMailbox(postRequestBody, userId, meta) {
    logger.info("Calling to Microsoft API in this %j mailbox", userId);
    logger.info("Post request: %j", postRequestBody);

    // Save data
    const actionUrl = `/users/${userId}/contacts`;

    return instance.post(actionUrl, postRequestBody);
  }

  function emitData(data) {
    const id = data.id;
    const messageBody = _.omitBy(data, (value, key) =>
      key.startsWith("@odata.")
    );

    self.emit("data", messageBody);
  }

  function emitError(e) {
    self.emit("error", e);
  }

  function emitEnd() {
    self.emit("end");
  }

  const transformedData = transform(msg.data, cfg);
  const mailbox = msg.data?.mailboxId;
  logger.info("Mailbox provided: %j", mailbox);

  if (!mailbox) {
    throw { name: "MailboxError", message: "Shared Mailbox not provided" };
  }
  delete msg.data?.mailboxId;
  try {
    const result = await addContactToSharedMailbox(
      transformedData,
      mailbox,
      msg.metadata
    );

    logger.info("Result of the api call: %j", result);

    const metadata = getMetadata(msg.metadata);

    emitData({ data: transformedData, metadata });
  } catch (error) {
    logger.info("Error in the call to Microsoft API. Error: %j", error);
    logger.error("Error calling Microsoft API. Error: %j", error);
  }
}

module.exports.process = processAction;
