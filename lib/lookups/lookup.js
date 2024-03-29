/**
 * This action will be called via REST API http://node:port/process and works like an express js middleware
 * Make sure that an appropriate response is sent. Unexpected errors are caught by an error handler
 *
 * @param {Function} req - express js middleware
 * @param {Function} res - express js middleware
 * @param {Function} next - express js middleware
 * @param {Object} actionParams - action parameters - { actionName: "string", secretId: "string", data: "object"}
 */

async function processAction(req, res, _, actionParams) {
  const { secretId, data } = actionParams;
  const { ferryman } = req;
  const { operationId, parameters, cfg } = data;
  const { process: triggerProcess } = require(`../triggers/${operationId}`);

  // in the data it should be always the operationId
  // we remove because it is not a parameter of the msg data object
  const msg = { data: parameters || {} };

  const snapshot = {},
    incomingMessageHeaders = {};
  const tokenData = { function: operationId };

  // only when the secretId parameter is provided
  if (secretId) {
    const { authorization } = req.headers;
    const splittedAuthorization = authorization.split(" ");
    const token = splittedAuthorization[1];

    try {
      const secret = await ferryman.fetchSecret(secretId, token);
      Object.assign(cfg, secret);
    } catch (error) {
     this.logger.error("Error getting the secret", error);
    }
  }

  // to not fail the lookup function when they call to the emit function
  globalThis.emit = () => {};

  const dataResponse = await triggerProcess(
    msg,
    cfg,
    snapshot,
    incomingMessageHeaders,
    tokenData
  );

  return res.send(dataResponse);
}

module.exports.process = processAction;
