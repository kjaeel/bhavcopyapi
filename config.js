/* eslint-disable no-unused-vars */
//import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3008,
    ip: process.env.IP || 'localhost',
    apiRoot: process.env.API_ROOT || '',
    mysql: {
          host : 'localhost',
          user : 'root',
          password : '',
          database : 'bhavcopy'
    },
    average1 : 5,
    average3 :15,
    stochastic :8
  },
  test: { },
  development: {

    database : {
      host : ['hb-1-001.mbzq1s.0001.apse1.cache.amazonaws.com'],
      password : 'voot$redis@123'
    },
    mysql : {
      host : 'localhost',
      userName : 'root',
      password : 'root',
      databaseName : 'bhavcopy',
      multipleStatements : true
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mysql: {
      database : {
        host : ['hb-1-001.mbzq1s.0001.apse1.cache.amazonaws.com'],
        password : 'voot$redis@123'
      },
      databaseMysql : {
        host : 'localhost',
        userName : 'root',
        password : 'root',
        databaseName : 'bhavcopy'
      }
    }
  }
}

module.exports = config.all
//export default module.exports
