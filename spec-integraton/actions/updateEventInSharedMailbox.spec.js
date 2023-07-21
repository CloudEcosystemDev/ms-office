const { getContext, getAccessToken } = require("../common");
const { expect } = require("chai");
const action = require("../../lib/actions/updateEventInSharedMailbox");

describe("Action updateEventInSharedMailbox test", () => {
  it("should update event in shared mailbox", async () => {
    const cfg = {
      "accessToken": await getAccessToken(),
    };
    const data =
        {
          mailboxId: "Shared@FlowMateDemo.onmicrosoft.com",
          eventId: "AAMkAGFmM2FlODk0LWEyMGItNGNkZS04MGRlLTM3Y2RmMjQ5ZTk3OQBGAAAAAACXWdG3U434SJV9FpMAJD_QBwCUhjz_nlgmRJPygR0d04NTAAAAAAENAACUhjz_nlgmRJPygR0d04NTAAAqdLp7AAA=",
          "categories": ["Red category"]
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
