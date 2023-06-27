const { transform } = require("@openintegrationhub/ferryman");
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
  self.logger.info('Trigger getContactFolders started');
  const instance = new ApiClient(cfg, self);

  // Set the snapshot if it is not provided
  snapshot.lastUpdated = snapshot.lastUpdated || new Date(0).getTime();
  const { snapshotKey, arraySplittingKey, syncParam, skipSnapshot } =
    cfg.nodeSettings;

  async function getContactFolders(instance) {
    let folders = [];

    const actionUrl = "/me/contactFolders/delta";

    let result = await instance.get(`${actionUrl}`);

    if ("value" in result) {
      folders = folders.concat(result.value);
    } else {
      self.logger.info("Missing value key in response!");
      self.logger.info(result);
    }

    // Loop through all pages
    while ("@odata.nextLink" in result) {
      result = await instance.get(`${result["@odata.nextLink"]}`);
      if ("value" in result) {
        folders = folders.concat(result.value);
      } else {
        self.logger.info("Missing value key in response!");
        self.logger.info(result);
      }
    }

    return folders;
  }

  async function getAllContactFolders(from, until) {
    let contacts = await getContactFolders(instance);
    self.logger.info(`${contacts.length} results found`);

    const filteredContacts = [];
    const length = contacts.length;
    for (let i = 0; i < length; i += 1) {
      if ("lastModifiedDateTime" in contacts[i]) {
        const timestamp = Date.parse(contacts[i].lastModifiedDateTime);
        if (timestamp >= from && timestamp <= until) {
          filteredContacts.push(contacts[i]);
        }
      } else {
        return contacts;
      }
    }

    return filteredContacts;
  }

  // Get all contacts starting from last snapshot or all contacts if no snapshot exists
  const contacts = await getAllContactFolders(snapshot.lastUpdated, Date.now());

  self.logger.info(`Found ${contacts.length} new records.`);
  if (skipSnapshot) {
    return contacts;
  }
  if (contacts.length > 0) {
    contacts.forEach((elem) => {
      const newElement = {};
      delete elem.id;

      newElement.metadata = getMetadata(msg.metadata);
      newElement.data = elem;

      // newElement.data = transform(newElement.data, cfg);

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
}

module.exports = {
  process: processTrigger,
};
