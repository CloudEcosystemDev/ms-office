'use strict';

const request = require('request-promise').defaults({ simple: false, resolveWithFullResponse: true });

function ApiClient(config, component) {

    const microsoftGraphURI = (process.env.NODE_ENV && process.env.NODE_ENV === 'test')  ? 'http://localhost:3099/v1.0' : 'https://graph.microsoft.com/v1.0';

    return {

        post: async function postReq(apiCall, requestBody) {

            function setOptions(accessToken) {
                let requestHeaders = {
                    Authorization: 'Bearer ' + accessToken
                };
                let options = {
                    method: 'POST',
                    uri: microsoftGraphURI + apiCall,
                    json: true,
                    body: requestBody,
                    headers: requestHeaders
                };

                return options;
            }

            const options = setOptions(config.accessToken);

            let result;
            try {
              result = await request(options);
            } catch(e) {
              console.log(e);
              return false;
            }
            // console.log('Result:', result);
            return result.body;
        },
        patch: async function patchReq(apiCall, requestBody) {

            function setOptions(accessToken) {
                let requestHeaders = {
                    Authorization: 'Bearer ' + accessToken
                };
                let options = {
                    method: 'PATCH',
                    uri: microsoftGraphURI + apiCall,
                    json: true,
                    body: requestBody,
                    headers: requestHeaders
                };

                return options;
            }

            const options = setOptions(config.accessToken);
            // console.log('Patch-Options:', options);

            let result;
            try {
              result = await request(options);
            } catch(e) {
              console.log(e);
              return false;
            }
            // console.log('Result-Patch:', result);
            return result.body;
        },
        get: async function getReq(apiCall) {

            function setOptions(accessToken) {
                let requestHeaders = {
                    Authorization: 'Bearer ' + accessToken
                };
                let options = {
                    method: 'GET',
                    uri: microsoftGraphURI + apiCall,
                    json: true,
                    headers: requestHeaders
                };

                return options;
            }

            const options = setOptions(config.accessToken);
            // console.log('Get options:', options);
            let result;
            try {
              result = await request(options);
            } catch(e) {
              console.log(e);
              return false;
            }
            // console.log('Result:', result);
            return result.body;
        },
        delete: async function deleteReq(apiCall) {

            function setOptions(accessToken) {
                let requestHeaders = {
                    Authorization: 'Bearer ' + accessToken
                };
                let options = {
                    method: 'DELETE',
                    uri: microsoftGraphURI + apiCall,
                    json: true,
                    headers: requestHeaders
                };

                return options;
            }

            const options = setOptions(config.accessToken);

            let result;
            try {
              result = await request(options);
            } catch(e) {
              console.log(e);
              return {success: 'failed'};
            }
            // console.log('Result:', result);
            let status = 'failed';

            if (result.statusCode === 200 || result.statusCode === 204) status = 'confirmed';
            else if (result.statusCode === 401 || result.statusCode === 403) status = 'denied';

            return {status, timestamp: Date.now()};
        },
    };
}

module.exports = ApiClient;
