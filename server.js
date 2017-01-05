#!/usr/bin/env node

'use strict';

const pck = require('./package');
const path = require('path');
const SERVER_NAME = 'highcharts-convert';
const SERVER_SCRIPT_PATH = path.join(__dirname, 'lib', SERVER_NAME + '.js');
const DEFAULT_HOSTNAME = '127.0.0.1';
const DEFAULT_PORT = 3030;

var args = require('yargs')
  .usage(`Usage: ${pck.name} start [-h HOST][-p PORT] -- [options]`)
  .command('start', 'Starts highcharts-convert HTTP server')
  .alias('h', 'hostname')
  .alias('h', 'host')
  .describe('h', 'Hostname of the server')
  .alias('p', 'port')
  .describe('p', 'Port the server will listen on')
  .default({
    p: DEFAULT_PORT,
    h: DEFAULT_HOSTNAME
  })
  .check((argv) => {
    if (!argv._[0] || !argv._[0].match(/start/)) {
      argv._[0] = 'start'
}
    return true;
  })
  .help('help')
  .showHelpOnFail(false, `Try ${SERVER_NAME} --help for available options`)
  .version(() => pck.version).argv;

const winston = require('winston');
const spawn = require('child_process').spawn;
const phantomjs = require('phantomjs-prebuilt');

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      label: SERVER_NAME
    })
  ]
});
logger.cli();

function exitProcess(signal) {
  return () => {
    server.kill(signal);
    logger.warn('Terminating converter (received %s)', signal);
    return process.exit(0);
  };
}

var childArgs = [SERVER_SCRIPT_PATH]
  .concat(['-port', args.p, '-host', args.h])
  .concat(args._);

var server = spawn(phantomjs.path, childArgs, { stdio: 'inherit' });
logger.info('Started converter on %s:%s (PID: %s)', args.h, args.p, server.pid);

server.on('error', (err) => logger.error('Failed to start [%s]', SERVER_NAME, err));

server.on('close', (code) => logger.info('Converter exited successfully (code: %s)', code || server.exitCode || 0));

process.once('SIGINT', exitProcess('SIGINT'));
process.once('SIGTERM', exitProcess('SIGTERM'));
