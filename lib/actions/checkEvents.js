const { newMessage } = require('../helpers');
const ApiClient = require('../apiClient');

module.exports.process = processAction;

async function processAction(msg, cfg)
{
    const instance = new ApiClient(cfg, this);

    const currentTime = msg.body.time || (new Date()).toISOString();

    const filter = encodeURIComponent(`start/dateTime le ${currentTime} and end/dateTime ge ${currentTime}`);
    const events = await apiClient.get(`/me/events?$filter=${filter}`);

    return messages.newMessage
    ({
        available: !events.value.length
    });
}
