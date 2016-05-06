'use strict';

module.exports = {
  app: {
    title: '{{NOTEMS_TITLE}}',
    description: '{{NOTEMS_DESC}}',
    keywords: 'mongodb, node.js'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    // Stream defaults to process.stdout
    // Uncomment to enable logging to a log on the file system
    options: {
      stream: 'access.log'
    }
  }
};
