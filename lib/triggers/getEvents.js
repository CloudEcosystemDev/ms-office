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
  // Authenticate and get the token from Snazzy Contacts
  console.log({ msg, cfg });

  const self = this;
  const instance = new ApiClient(cfg, self);

  // Set the snapshot if it is not provided
  snapshot.lastUpdated = snapshot.lastUpdated || new Date(0).getTime();

  async function getEvents(instance, lastUpdated) {
    let events = [];

    let actionUrl = "/me/calendar/events?";
    if (lastUpdated) {
      actionUrl += `$filter=lastModifiedDateTime gt ${lastUpdated}`;
    }

    let result = await instance.get(`${actionUrl}&$top=100&$skip=0`);

    if ("value" in result) {
      events = events.concat(result.value);
    } else {
      console.log("Missing value key in response!");
      console.log(result);
    }

    // Loop through all pages
    let c = 0;
    while ("@odata.nextLink" in result) {
      c += 100;
      result = await instance.get(`${actionUrl}&$top=100&$skip=${c}`);
      if ("value" in result) {
        events = events.concat(result.value);
      } else {
        console.log("Missing value key in response!");
        console.log(result);
      }
    }

    return events;
  }

  async function getAllEvents(from) {
    // console.log('Getting contacts from base folder');
    let events = await getEvents(instance, from);
    // console.log(`Adding ${contacts.length} contacts to result set`);
    console.log(`${events.length} results found`);

    return events;
  }

  // Get all contacts starting from last snapshot or all contacts if no snapshot exists
  const events = await getAllEvents(snapshot.lastUpdated);

  console.log(`Found ${events.length} new records.`);

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
    console.log(`New snapshot: ${JSON.stringify(snapshot)}`);
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
    console.log(`ERROR: ${e}`);
    self.emit("error", e);
  }
}

module.exports = {
  process: processTrigger,
};



function* run(msg) { return  { 'data': {  'subject': 'Lets go for lunch',   'body': {     'contentType': 'HTML',     'content': 'Does noon work for you?'   },   'start': {       'dateTime': '2022-08-25T12:00:00',       'timeZone': 'Pacific Standard Time'   },   'end': {       'dateTime': '2022-08-25T14:00:00',       'timeZone': 'Pacific Standard Time'   },   'location':{       'displayName':'Harrys Bar'   },   'attendees': [     {       'emailAddress': {         'address':'samanthab@contoso.onmicrosoft.com',         'name': 'Samantha Booth'       },       'type': 'required'     }   ],   'allowNewTimeProposals': true,   'transactionId':'7E163156-7762-4BEB-A1C6-729EA81755A7' }}}