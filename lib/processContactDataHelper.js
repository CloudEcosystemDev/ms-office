'use strict';

const moment = require('moment-timezone');
const _ = require('lodash');
const Q = require('q');

function processContactData(cfg, messageBody)
{
    let defer = Q.defer();
    console.log("Hi, you reached FLAG 2 - processing contact data!");
    try
    {
        console.log("Hi, you reached FLAG 2.1 - TRYING to process contact data!");
        let result = buildPostBody(cfg, messageBody);
        defer.resolve(result);
    }
    catch (err)
    {
        defer.reject(err);
    }

    return defer.promise;
}

module.exports.processContactData = processContactData;
//module.exports.formatDate = formatDate;