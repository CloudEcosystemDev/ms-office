const { transform } = require("@openintegrationhub/ferryman");
const {
  getMetadata,
} = require("../utils/helpers");
const _ = require("lodash");
const ApiClient = require("../apiClient");

async function processAction(msg, cfg) {
  const self = this;

  const instance = new ApiClient(cfg, self);

  // async function checkExistent(id, folders) {
  //   try {
  //     let results = await instance.get(`/me/contacts/${id}`);

  //     if (results) {
  //       if ("id" in results) {
  //         return results;
  //       }

  //       if (results.value && results.value.length > 0) {
  //         return results.value[0];
  //       }
  //     }

  //     // Check in all folders
  //     for (const key in folders) {
  //       results = await instance.get(
  //         `/me/contactFolders/${folders[key]}/contacts/${id}`
  //       );

  //       if (results) {
  //         if ("id" in results) {
  //           return results;
  //         }

  //         if (results.value && results.value.length > 0) {
  //           return results.value[0];
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error:", err);
  //     return false;
  //   }

  //   return false;
  // }

  // function scoreCandidate(contact, candidate) {
  //   let score = 0;

  //   if ("givenName" in contact && "givenName" in candidate) {
  //     if (contact.givenName == candidate.givenName) {
  //       score += 0.5;
  //     } else if (
  //       contact.givenName.indexOf(candidate.givenName) > -1 ||
  //       candidate.givenName.indexOf(contact.givenName) > -1
  //     ) {
  //       score += 0.25;
  //     }
  //   }

  //   if ("surname" in contact && "surname" in candidate) {
  //     if (contact.surname == candidate.surname) {
  //       score += 0.5;
  //     } else if (
  //       contact.surname.indexOf(candidate.surname) > -1 ||
  //       candidate.surname.indexOf(contact.surname) > -1
  //     ) {
  //       score += 0.25;
  //     }
  //   }

  //   return score;
  // }

  // async function findExistent(contact, folders){
  //   let candidate = false;
  //   let candidateScore = -1;

  //   if (contact && 'emailAddresses' in contact) {
  //     for(let i=0; i<contact.emailAddresses.length; i+=1) {
  //       try {
  //         const email = contact.emailAddresses[i].address;

  //         const filter = `emailAddresses/any(a:a/address eq '${email}')`.replace(/ /g, '%20').replace(/'/g, '%27');
  //         let results = await instance.get(`/me/contacts?$filter=${filter}`);

  //         if(results) {
  //           if('id' in results) {
  //             const currentScore = scoreCandidate(contact, results);
  //             if(currentScore > candidateScore || !candidate) {
  //               candidate = results;
  //               candidateScore = currentScore;
  //             }
  //           }

  //           if(results.value && results.value.length > 0){
  //             for(let j=0; j < results.value.length; j+=1) {
  //               const currentScore = scoreCandidate(contact, results.value[j]);
  //               if(currentScore > candidateScore || !candidate) {
  //                 candidate = results.value[j];
  //                 candidateScore = currentScore;
  //               }
  //             }
  //           }
  //         }

  //         return candidate;
  //       } catch (err) {
  //         console.error('Error:', err);
  //         return candidate;
  //       }
  //     }
  //   }

  //   return candidate;
  // }

  async function addContactToFolder(postRequestBody,folderId, meta) {
    // Save data
    const actionUrl = `/me/folders/${folderId}/contacts`;

    // let existent = false;

    // if(existent === false){
    // existent = await findExistent(postRequestBody, folders);
    // if(existent !== false && 'id' in existent) console.log('Found record with matching email');
    // }

    // if(existent !== false && existent.id) {
    //   const newBody = mergeArrays(postRequestBody, existent);
    //   return instance.patch(`${actionUrl}/${existent.id}`, newBody);
    // } else {
    //   return instance.post(actionUrl, postRequestBody);
    // }
    return instance.post(actionUrl, postRequestBody);
  }

  function emitData(data) {
    const id = data.id;
    const messageBody = _.omitBy(data, (value, key) =>
      key.startsWith("@odata.")
    );

    // self.emit('data', newMessage(messageBody));
    self.emit("data", messageBody);
  }

  function emitError(e) {
    self.emit("error", e);
  }

  function emitEnd() {
    self.emit("end");
  }

  const transformedData = transform(msg.data, cfg);
  const folder = msg.data?.parentFolderId;
  if (!folder) {
    throw({name:"FolderError", message: "Folder not provided"});
  }
  const result = await addContactToFolder(transformedData, folder, msg.metadata);
  console.log({ result });

  const metadata = getMetadata(msg.metadata);


  emitData({ data: transformedData, metadata });
}

module.exports.process = processAction;
