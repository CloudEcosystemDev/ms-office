const { getContext, getAccessToken } = require("../common");
const { expect } = require("chai");
const action = require("../../lib/actions/addEventToSharedMailbox");

describe("Action addEventToSharedMailbox test", () => {
  it("should add event to shared mailbox", async () => {
    const cfg = {
      "accessToken": await getAccessToken(),
    };
    const data =
        {
          mailboxId: "Shared@FlowMateDemo.onmicrosoft.com",
      "subject": "Let's go for lunch",
        "body": {
      "contentType": "HTML",
          "content": "Does mid month work for you?"
    },
      "start": {
      "dateTime": "2019-03-15T12:00:00",
          "timeZone": "Pacific Standard Time"
    },
      "end": {
      "dateTime": "2019-03-15T14:00:00",
          "timeZone": "Pacific Standard Time"
    },
      "location":{
      "displayName":"Harry's Bar"
    },
      "attendees": [
      {
        "emailAddress": {
          "address":"adelev@contoso.onmicrosoft.com",
          "name": "Adele Vance"
        },
        "type": "required"
      }
    ],
        "transactionId":"7E163156-7762-4BEB-A1C6-729EA81755A7"
    }
    const msg = { attachments: {}, data, metadata: {}, headers: {} };
    const snapshot = {};
    const incomingMessageHeaders = {};
    const tokenData = {};
    const ctx = getContext();
    await action.process.call(ctx, msg, cfg, snapshot, incomingMessageHeaders, tokenData);
    expect(ctx.emit.callCount).to.be.equal(1);
    expect(ctx.emit.args[0][0]).to.be.equal('data');
    expect(ctx.emit.args[0][1].data).to.be.equal(data);
  });
});
