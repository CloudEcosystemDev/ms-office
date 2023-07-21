const ApiClient = require("../apiClient");
const { getMetadata } = require("../utils/helpers");

/**
 * This method will be called from OIH platform providing following data
 *
 * @param msg - incoming message object that contains ``body`` with payload
 * @param cfg - configuration that is account information and configuration field values
 * @param snapshot - saves the current state of integration step for the future reference
 */
async function processTrigger(msg, cfg, snapshot = {}) {
  const self = this;
  self.logger.info('Trigger getEventsFromSharedMailbox started');
  const mailbox = cfg.triggerParams?.mailboxId || null;
  if (!mailbox) {
    emitError(new Error("No Mailbox Provided"));
    throw new Error("No Mailbox Provided");
  }
  const instance = new ApiClient(cfg, self);

  // Set the snapshot if it is not provided
  snapshot.lastUpdated = snapshot.lastUpdated || new Date(0).getTime();
  const { snapshotKey, arraySplittingKey, syncParam, skipSnapshot } =
    cfg.nodeSettings;

  async function getEvents(instance, lastUpdated) {
    let events = [];

    let actionUrl = `/users/${mailbox}/calendar/events?`;
    if (lastUpdated) {
      actionUrl += `$filter=lastModifiedDateTime gt ${lastUpdated}&`;
    }

    let result = await instance.get(`${actionUrl}$top=100&$skip=0`);

    if ("value" in result) {
      events = events.concat(result.value);
    } else {
      self.logger.info("Missing value key in response!");
      self.logger.info(result);
    }

    // Loop through all pages
    let c = 0;
    while ("@odata.nextLink" in result) {
      c += 100;
      result = await instance.get(`${actionUrl}$top=100&$skip=${c}`);
      if ("value" in result) {
        events = events.concat(result.value);
      } else {
        self.logger.info("Missing value key in response!");
        self.logger.info(result);
      }
    }

    return events;
  }

  async function getAllEvents(from) {
    let events = await getEvents(instance, from);
    self.logger.info(`${events.length} results found`);
    return events;
  }

  // Get all contacts starting from last snapshot or all contacts if no snapshot exists
  const events = await getAllEvents(snapshot.lastUpdated);

  self.logger.info(`Found ${events.length} new records.`);
  if (skipSnapshot) {
    return events;
  }
  if (events.length > 0) {
    events.forEach((elem) => {
      const newElement = {};
      delete elem.id;

      newElement.metadata = getMetadata(msg.metadata);
      newElement.data = elem;

      // Emit the object with meta and data properties
      self.emit("data", newElement);
    });

    // Save current time in snapshot
    snapshot.lastUpdated = Date.now();
    self.logger.info(`New snapshot: ${JSON.stringify(snapshot)}`);
    self.emit("snapshot", snapshot);
  } else {
    self.emit("snapshot", snapshot);
  }

  /**
   * This method will be called from OIH platform if an error occured
   *
   * @param e - object containg the error
   */
  function emitError(e) {
    self.logger.error(`ERROR: ${e}`);
    self.emit("error", e);
  }
}

module.exports = {
  process: processTrigger,
};
