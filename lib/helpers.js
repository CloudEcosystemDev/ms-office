
const uuid = require('uuid');

function newMessage(data) {
  const msg = {
    id: uuid.v4(),
    attachments: {},
    data,
    headers: {},
    metadata: {},
  };

  return msg;
}


function objectToKey(obj) {
  const objType = typeof obj;
  if(objType !== 'object') return obj;
  if(Array.isArray(obj)) return obj.join('|');

  const keys = Object.keys(obj).sort();

  const keyParts = [];
  let index;
  for(index in keys) {
    keyParts.push(`${keys[index]}_${obj[keys[index]]}`);
  }
  return keyParts.join('_');
}

function mergeArrays(newEntry, oldEntry) {
  for(const key in oldEntry) {
    if(Array.isArray(oldEntry[key])) {
      if(key in newEntry) {
        const arrayData = oldEntry[key];
        const hash = {};
        for(let i=0; i<arrayData.length; i+=1) {
          const hashKey = objectToKey(arrayData[i]);

          hash[hashKey] = 1;
        }

        for(let i=0; i<newEntry[key].length; i+=1) {
          const hashKey = objectToKey(newEntry[key][i]);

          if(!(hashKey in hash)) {
            arrayData.push(newEntry[key][i]);
          }
        }

        newEntry[key] = arrayData;
      } else {
        newEntry[key] = oldEntry[key];
      }
    }
  }

  return newEntry;
}

module.exports = {
  newMessage,
  mergeArrays,
};
