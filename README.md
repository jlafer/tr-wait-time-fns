# tr-wait-time-fns

This is a library of Twilio Flex Serverless functions that demonstrate the reading of real-time statistics from TaskRouter.

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [npm](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd tr-wait-time-fns

npm install
```

## Configure
This project was created with the [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit) and follows those standards. It must be configured in your local project folder prior to deployment.

The functions rely on a set of environment variables. They should be set in a `.env` file, placed at the root folder of your project, prior to running and testing locally, and before deploying to Twilio Serverless. See the `.env.sample` file for an example of how the library functions can be configured.

### ACCOUNT_SID
This is your Twilio Account SID.

### AUTH_TOKEN
This is the Auth Token associated with the Twilio Account SID.

### WORKSPACE_SID
This is the Twilio TaskRouter Workspace SID.

### SYNC_SERVICE_SID
This is the SID value for a Twilio Sync service. A Sync document is created in the service for each TaskQueue for which statistics are retrieved. It can be the default Sync service though be careful of namespace collisions (it uses queue friendly names). A new Sync service can be created easily in the Twilio Sync console and its SID copied/pasted.

### STAT_TTL
This an optional variable that indicates how long (in seconds) statistic values stay in the cache before being refreshed. If not supplied, the default value is `180`.

## Functions

### /getLongestWaitTime
This function retrieves the current longest waiting-time of any Task in a specific TaskQueue. This tends to be a good proxy for the current estimated wait time for that queue. To call the function, simply POST a `queueName` parameter value in the body of the Serverless https request like this: `{"queueName": "MyQueueName"}`.

## Deploy
To deploy the function(s) in this library, use the Twilio CLI and the Serverless Toolkit plugin. First, ensure that the CLI is using the correct Twilio project. You can verify that by running `twilio profiles:list`. The following command will deploy the functions to a service in the Twilio Serverless environment:
```
twilio serverless:deploy
```

