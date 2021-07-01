exports.handler = async function(context, event, callback) {
  try {
    const {queueName} = event;
    const {WORKSPACE_SID} = context;
    const client = context.getTwilioClient();

    const stats = await client.taskrouter.workspaces(WORKSPACE_SID)
    .taskQueues('WQc046d4515b9c5259e6562f6f79518fb7')
    .realTimeStatistics()
    .fetch();
    console.log('age: ', stats.longestTaskWaitingAge);
    
    return callback(null, {waitTime: stats.longestTaskWaitingAge});
  }
  catch (error) {
    console.log(error);
    callback(error, 'Something went wrong');
  }
};
