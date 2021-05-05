var run = require('parallel-webpack').run,
    configPath = require.resolve('./webpack.parallel.config.js');

run(configPath, {
    watch: false,
    maxRetries: 1,
    stats: true,
    maxConcurrentWorkers: 4
});