(function () {
    var optimist = require('optimist');

    var oto = require(__dirname + '/oto');

    var argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    oto();
})();
