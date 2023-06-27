const { getContext, getAccessToken } = require("../common");
const { expect } = require("chai");
const trigger = require("../../lib/triggers/getContacts");

describe("Trigger getContacts test", () => {
  it("should return contacts", async () => {
    const msg = { attachments: {}, data: {}, metadata: {}, headers: {} };
    const cfg = {
      accessToken: await getAccessToken(),
      nodeSettings: {}
    };
    const snapshot = {};
    const ctx = getContext();
    await trigger.process.call(ctx, msg, cfg, snapshot);
    expect(ctx.emit.callCount).to.be.equal(10);
    expect(ctx.emit.args[0][0]).to.be.equal('data');
  });
});
