#
# zmq-calc-worker.js
#
# This is the worker for the zmq-calc-server.js app.
#
# It is setup in the zmq-calc-cluster module. It does the following.
# - setup queues
# - send 'ready' message to Result queue
# - listens for 'job' messages
# - when 'job' message is received use zmq-calc module to perform work
# - send result back by sending a 'result' message in Result queue
#
#

exports.run = () ->
  calc = require('./zmq-calc');
  util = require("util");
  factory = require('./zmq-calc-factory');
  
  DEBUG = process.env.DEBUG || false;
  
  log = (msg) => util.log("#{process.pid} [Worker]: #{msg}")
  
  performJob = (msg) => calc.calc(msg.operand1, msg.operand2, msg.operator)
  
  sendErrorMessage = (msg) => resultQ.send(factory.createErrorMessage(process.pid, msg))
  
  sendResultMessage = (msg, result) => resultQ.send(factory.createResultMessage(process.pid, msg, result))
  
  showJobMessage = (msg) =>
    s = "#{process.pid}: Received job from pid #{msg.pid}"
    if(DEBUG)
      s += "\n"
      s += util.inspect(msg)
    log(s)
    return
  
  receiveJobMessage = (data) =>
    msg = JSON.parse(data)
    if DEBUG
      log("received: #{util.inspect(msg)}")
  
    switch msg.type
      when 'job'
        showJobMessage(msg)
        result = performJob(msg)
        sendResultMessage(msg, result)
      else
        sendErrorMessage(msg)
    return

  log('connecting to job queue...')
  
  jobQ = factory.createPullJobQueue()
  
  log('listening for job messages...')
  jobQ.on('message', receiveJobMessage)
  
  log('connecting to result queue...')
  resultQ = factory.createPushResultQueue()
  
  readyMsg = factory.createReadyMessage(process.pid)
  log('sending ready message' + readyMsg)
  resultQ.send(readyMsg)
