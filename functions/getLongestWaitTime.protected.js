let path = Runtime.getFunctions()['helpers'].path;
let helpers = require(path);
const {
  getAndVerifyEnvVars, getQueueDocByName, getTaskQueueByName,
  getQueueStatsFromApi, createQueueStatSyncDoc
} = helpers;

exports.handler = async function(context, event, callback) {
  try {
    const {queueName} = event;
    const client = context.getTwilioClient();
    const envVars = getAndVerifyEnvVars(context);
    const {SYNC_SERVICE_SID, WORKSPACE_SID} = envVars;

    let queueDoc = await getQueueDocByName(client, SYNC_SERVICE_SID, queueName);
    if (!queueDoc) {
      const queue = await getTaskQueueByName(client, WORKSPACE_SID, queueName);
      const stats = await getQueueStatsFromApi(client, WORKSPACE_SID, queue.sid);
      queueDoc = await createQueueStatSyncDoc(client, SYNC_SERVICE_SID, queue, stats)
    }
    const stat = queueDoc.data.stat;
    console.log('waitTime: ', stat);
    return callback(null, {queue: queueName, sid: queueDoc.data.sid, waitTime: stat});
  }
  catch (error) {
    console.log(error);
    callback(error, 'getLongestWaitTime: something went wrong');
  }
};
