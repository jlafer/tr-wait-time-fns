const {checkEnvVariable} = require('jlafer-twilio-runtime-util');

const getQueueDocByName = async (client, syncSvcSid, queueName) => {
  try {
    const queueDoc = await getSyncDoc(client, syncSvcSid, queueName);
    return queueDoc;  
  }
  catch (err) {
    return undefined;
  }
};

const getSyncDoc = (client, syncSvcSid, uniqueName) => {
  return client.sync.services(syncSvcSid).documents(uniqueName).fetch();
};

const getTaskQueueByName = async (client, wrkspcSid, queueName) => {
  const queues = await getQueuesFromApi(client, wrkspcSid);
  const queue = queues.find(q => q.friendlyName === queueName);
  if (!queue) {
    throw new Error(`TaskQueue named ${queueName} not found`);
  }
  return queue;
};

const getQueuesFromApi = (client, wrkspcSid) => {
  return client.taskrouter.workspaces(wrkspcSid).taskQueues.list({limit: 50});
};

const createQueueStatSyncDoc = (client, syncSvcSid, queue, stats) => {
  const {friendlyName, sid} = queue;
  return client.sync.services(syncSvcSid).documents.create({
    uniqueName: friendlyName,
    data: {sid: sid, stat: stats.longestTaskWaitingAge},
    ttl: 180
  });
};

const getQueueStatsFromApi = (client, wrkspcSid, queueSid) => {
  return client.taskrouter.workspaces(wrkspcSid)
  .taskQueues(queueSid)
  .realTimeStatistics()
  .fetch();
};

function getAndVerifyEnvVars(context) {
  const envVars = {};
  envVars.WORKSPACE_SID = checkEnvVariable(context, 'WORKSPACE_SID');
  envVars.SYNC_SERVICE_SID = checkEnvVariable(context, 'SYNC_SERVICE_SID');
  envVars.STAT_TTL = 180;
  return envVars;
}

exports.getQueueDocByName = getQueueDocByName;
exports.getTaskQueueByName = getTaskQueueByName;
exports.getQueueStatsFromApi = getQueueStatsFromApi;
exports.createQueueStatSyncDoc = createQueueStatSyncDoc;
exports.getAndVerifyEnvVars = getAndVerifyEnvVars;
