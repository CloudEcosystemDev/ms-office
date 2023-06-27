const { getContext, getAccessToken } = require("../common");
const { expect } = require("chai");
const action = require("../../lib/actions/addContact");

describe("Action addContact test", () => {
  it("should add data", async () => {
    const cfg = {
      "accessToken": await getAccessToken(),
    };
    const data = {
      "displayName": "Webstorm Test 7",
      "givenName": "givenName-value 7",
    }
    const msg = { attachments: {}, data, metadata: {}, headers: {} };
    const snapshot = {};
    const incomingMessageHeaders = {};
    const tokenData = {"function":"addContact"};
    const ctx = getContext();
    await action.process.call(ctx, msg, cfg, snapshot, incomingMessageHeaders, tokenData);
    expect(ctx.emit.callCount).to.be.equal(1);
    expect(ctx.emit.args[0][0]).to.be.equal('data');
    expect(ctx.emit.args[0][1].data).to.be.equal(data);
  });
});
