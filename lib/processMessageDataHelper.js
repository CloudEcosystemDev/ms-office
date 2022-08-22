'use strict';

const moment = require('moment-timezone');
const _ = require('lodash');
const Q = require('q');

function processMessageData(cfg, messageBody)
{
    let defer = Q.defer();

    try
    {
        let result = buildPostBody(cfg, messageBody);
        defer.resolve(result);
    }
    catch (err)
    {
        defer.reject(err);
    }

    return defer.promise;
}

module.exports.processMessageData = processMessageData;
module.exports.formatDate = formatDate;