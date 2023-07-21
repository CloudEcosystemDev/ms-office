const { getContext, getAccessToken } = require("../common");
const { expect } = require("chai");
const trigger = require("../../lib/triggers/getEventsFromSharedMailbox");

describe("Trigger getEventsFromSharedMailbox test", () => {
  it("should return events", async () => {
    const msg = { attachments: {}, data: {}, metadata: {}, headers: {} };
    const cfg = {
      "nodeSettings":{},
      "accessToken": await getAccessToken(),
      mailboxId: 'shared@FlowMateDemo.onmicrosoft.com'
    };
    const snapshot = { };
    const ctx = getContext();
    await trigger.process.call(ctx, msg, cfg, snapshot);
    expect(ctx.emit.callCount).to.be.equal(34);
    expect(ctx.emit.args[0][0]).to.be.equal('data');
  });
});
