// const logger = require('./logger.js')
const logger = require('./logger.cjs');
// console.log(logger.then)
logger.log('info', 'Hello, this is a raw logging event',   { 'foo': 'bar' });
// logger.info('text info', { meta: 1 });
// logger.warn('text warn');
// logger.error('text error');
// logger.error(new Error('something went wrong'));