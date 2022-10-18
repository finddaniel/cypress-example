const { defineConfig } = require('cypress');

const { WIKI_TOKEN } = process.env;

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://en.wikipedia.org',
        viewportHeight: 1080,
        viewportWidth: 1920,
        watchForFileChanges: false,
    },
    env: {
        login: 'Endpoint-homework',
        password: WIKI_TOKEN,
    },
});
