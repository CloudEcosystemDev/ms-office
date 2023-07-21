const _ = require("lodash");
const { newMessage } = require("../helpers");
const ApiClient = require("../apiClient");

function getCalendars(cfg, cb) {
  function processData(items) {
    let result = {};
    _.forEach(items.value, function setItem(item) {
      result[item.id] = item.name;
    });
    return result;
  }

  const instance = new ApiClient(cfg);

  return instance.get("/me/calendars").then(processData).nodeify(cb);
}

function processAction(msg, cfg) {
  const self = this;
  self.logger.info('Action updateEventInSharedMailbox started');
  const mailbox = msg.data?.mailboxId;
  const eventId = msg.data?.eventId;
  self.logger.info("Mailbox provided: %j", mailbox);
  self.logger.info("EventId provided: %j", eventId);

  if (!mailbox) {
    throw new Error("Shared Mailbox not provided");
  }
  if (!eventId) {
    throw new Error("Event Id not provided");
  }
  delete msg.data?.mailboxId;
  delete msg.data?.eventId;
  const apiCall = `/users/${mailbox}/calendar/events/${eventId}`;
  const instance = new ApiClient(cfg, self);

  function updateEvent(patchRequestBody) {
    return instance.patch(apiCall, patchRequestBody);
  }

  function emitData(data) {
    const messageBody = _.omitBy(data, (value, key) =>
      key.startsWith("@odata.")
    );
    self.emit("data", newMessage(messageBody));
  }

  function emitError(e) {
    self.logger.error({ error: e });
    self.emit("error", e);
  }

  function emitEnd() {
    self.emit("end");
  }

  let promise = updateEvent(msg.data).then(emitData).catch(emitError);
  return promise.finally(emitEnd);
}

module.exports.process = processAction;
module.exports.getCalendars = getCalendars;
