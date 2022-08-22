const _ = require('lodash');
const { newMessage } = require('../helpers');
const ApiClient = require('../apiClient');
const processEventData = require('../processEventDataHelper').processEventData;

function getCalendars(cfg, cb)
{
    function processData(items)
    {
        let result = {};
        _.forEach(items.value, function setItem(item)
        {
            result[item.id] = item.name;
        });
        return result;
    }

    const instance = new ApiClient(cfg);

    return instance
        .get('/me/calendars')
        .then(processData)
        .nodeify(cb);
}

function processAction(msg, cfg)
{
    const self = this;
    const calendarId = cfg.calendarId;

    const apiCall = `/me/calendars/${calendarId}/events`;

    const instance = new ApiClient(cfg, self);

    function createEvent(postRequestBody)
    {
        return instance.post(apiCall, postRequestBody);
    }

    function emitData(data)
    {
        const id = data.id;
        const messageBody = _.omitBy(data, (value, key) => key.startsWith('@odata.'));
        messageBody.calendarId = cfg.calendarId;
        self.emit('data', newMessage(messageBody));
    }

    function emitError(e)
    {
        self.emit('error', e);
    }

    function emitEnd()
    {
        self.emit('end');
    }

    let promise = processEventData(cfg, msg.body)
        .then(createEvent)
        .then(emitData)
        .fail(emitError);

    return promise.finally(emitEnd);
}

module.exports.process = processAction;
module.exports.getCalendars = getCalendars;
