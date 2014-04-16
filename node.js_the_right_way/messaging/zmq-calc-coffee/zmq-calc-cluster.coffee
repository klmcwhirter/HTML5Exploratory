#
# zmq-calc-cluster.js
#
# Manage the cluster for zmq-calc-server.js
#
# Once the desired number of worker queues have been registered and have become
# ready, the jobs are sent.
#


cluster = require('cluster');
util = require("util");

calc = require('./zmq-calc');
factory = require('./zmq-calc-factory');

DEBUG = process.env.DEBUG || false;

# Returns a random integer between min and max
# Using Math.round() will give you a non-uniform distribution!
getRandomInteger = (min, max) -> Math.floor(Math.random() * (max - min + 1) + min)

log = (msg) -> util.log("#{process.pid} [Master]: #{msg}")

exports.ZmqCalcCluster = class ZmqCalcCluster
  constructor: (@numWorkers, @numJobs) ->
    @readyWorkers = 0
    @numResults = 0
    @jobQ = null
    @resultQ = null
  
  exitIfDone: () ->
    if(@numResults >= @numJobs)
      log('all jobs completed. Exiting.')
      process.exit(0)

  sendJobMessage: () ->
    operand1 = getRandomInteger(1,100)
    operand2 = getRandomInteger(1,100)
    operatorIdx = getRandomInteger(0, calc.operators.length - 1)
    operator = calc.operators[operatorIdx]

    @jobQ.send(factory.createJobMessage(process.pid, operand1, operand2, operator))


  sendJobMessagesIfReady: () ->
    @readyWorkers += 1
    log("#{@readyWorkers} ready workers...")

    if @numWorkers <= @readyWorkers
      log('sending job messages')
      @sendJobMessage() for i in [1..@numJobs]
    return

  showReadyMessage: (msg) ->
    log("Worker with pid #{msg.pid} has become ready")

  showResultMessage: (msg) ->
    @numResults += 1
    s = "Received Result message from pid #{msg.pid} "
    s += "#{msg.operand1} #{msg.operator} #{msg.operand2} = #{msg.result}"
    s += "\n"
    s += "have received #{@numResults} results."
    log(s)

  showUnknownMessage: (msg) -> log("Received unknown Result message: #{msg}")

  receiveErrorMessage: (data) =>
    try
      msg = JSON.parse(data)
      log("Error message: #{util.inspect(msg)}")
    catch e
      log("Parsing error: #{e}\n#{data}")

  receiveResultMessage: (data) =>
    try
      msg = JSON.parse(data)
      switch msg.type 
        when 'ready'
          @showReadyMessage(msg)
          @sendJobMessagesIfReady()
        when 'result'
          @showResultMessage(msg)
          @exitIfDone()
        else
          @showUnknownMessage(msg)
    catch e
      log("Parsing error: #{e}\n#{data}")

  forkWorker = () ->
    worker = cluster.fork()
    worker.on('exit', (code, signal) -> forkWorker())

  forkWorkers: () ->
    log('Forking workers')
    cluster.setupMaster(
      exec: './zmq-calc-worker-wrapper.js',
      args: [],
      silent: false
    )

    log("here we go ... numWorkers=#{@numWorkers}")
    for i in [1..@numWorkers]
      log("forking worker #{i}");
      forkWorker();
    return

  run: () ->
    log('Creating job queue')
    @jobQ = factory.createPushJobQueue()
    log('Creating result queue')
    @resultQ = factory.createPullResultQueue()
    log('Subscribing to message on result queue')
    @resultQ.on('message', @receiveResultMessage)
    log('Subscribing to error on result queue')
    @resultQ.on('error', @receiveErrorMessage)

    @forkWorkers()
    return

exports.initialize = (numWorkers, numJobs) -> new ZmqCalcCluster(numWorkers, numJobs)
