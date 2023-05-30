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
  const result = await addContactToSharedMailbox(
    transformedData,
    mailbox,
    msg.metadata
  );

  const metadata = getMetadata(msg.metadata);

  emitData({ data: transformedData, metadata });
}

module.exports.process = processAction;
