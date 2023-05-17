const logger = require("@openintegrationhub/ferryman/lib/logging");
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

  const apiCall = `/me/calendar/events`;

  const instance = new ApiClient(cfg, self);

  function createEvent(postRequestBody) {
    return instance.post(apiCall, postRequestBody);
  }

  function emitData(data) {
    const messageBody = _.omitBy(data, (value, key) =>
      key.startsWith("@odata.")
    );
    self.emit("data", newMessage(messageBody));
  }

  function emitError(e) {
    logger.error({ error: e });
    self.emit("error", e);
  }

  function emitEnd() {
    self.emit("end");
  }

  let promise = createEvent(msg.data).then(emitData).catch(emitError);
  return promise.finally(emitEnd);
}

module.exports.process = processAction;
module.exports.getCalendars = getCalendars;
