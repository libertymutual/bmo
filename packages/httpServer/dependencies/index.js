import joi from 'joi'
import Koa from 'koa'
import Router from 'koa-router'
import commander from 'commander'
import pinoHttp from 'pino-http'

import app from './app'
import args from './args'
import errors from './errors'
import errorMap from './errorMap'
import events from './events'
import gracefulShutdown from './gracefulShutdown'
import health from './health'
import http from './http'
import loadRoute from './loadRoute'
import logger from './logger'
import middleware from './middleware'
import requestValidator from './requestValidator'
import swagger from './swagger'
import serveStatic from './serveStatic'
import serializers from './serializers'
import run from './run'
import server from './server'
import stop from './stop'

export default {
  args,
  commander: () => commander,
  errors,
  errorMap,
  events,
  gracefulShutdown,
  health,
  http,
  joi: () => joi,
  Koa: () => Koa,
  logger,
  loadRoute,
  middleware,
  pinoHttp: () => pinoHttp,
  requestValidator,
  Router: () => Router,
  serializers,
  serveStatic,
  swagger,
  stop,
  // These need to be at the end after everything else.
  app,
  server,
  run
}
