var fs = require('fs');
var colors = require('colors');
var yaml = require('js-yaml');
var mkdirp = require('mkdirp');
var child_process = require('child_process');

var oto = function () {
    var otoFilePath = 'otofile.yaml';
    var conf = yaml.safeLoad(fs.readFileSync(otoFilePath, 'utf8'));

    var dirDef = conf.dir;
    var moduleDef = conf.module;

    function log (tag, message) {
        console.log('%s:\t%s'.green, tag, message);
    }

    var dirList = [];
    for (var path in dirDef) {
        dirList.push({
            path: path,
            roll: dirDef[path]
        });
    }
    dirList.sort(function (a, b) { return (a.path > b.path) ? 1 : -1;});

    dirList.forEach(function (dir) {
        var path = dir.path;
        if (!fs.existsSync(path)){
            log('mkdir', path);
            mkdirp(path);
        }

        var mod;
        for (var roll in dir.roll) {
            if (!moduleDef[dir.roll[roll]]) {
                moduleDef[dir.roll[roll]] = {};                
            }
            moduleDef[dir.roll[roll]][roll] = path;
        }
    });

    var shell, vs;
    for (var mod in moduleDef) {
        shell = moduleDef[mod].shell;
        if (!shell) {
            continue;
        }

        vs = moduleDef[mod]['var'];
        vs.forEach(function (v) {
            var regExp = new RegExp('%' + v, 'g');
            shell = shell.replace(regExp, moduleDef[mod][v]);
        });

        log('module', mod);
        console.log(shell.grey);

        child_process.exec(shell, function (error, stdout, stderr) {
            if (stdout) {
                console.log(stdout);
            }
            if (stderr) {
                console.error(stderr);
            }
        });
    }
};

module.exports = oto;
