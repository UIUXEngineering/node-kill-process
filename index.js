/**
 * Kill node child processes
 *
 * http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn
 */

var psTree = require('ps-tree');

var killProcess = function (pid, signal, callback) {
    // console.info('KILLING %d PROCESS IF FOUND', pid);
    signal   = signal || 'SIGKILL';
    callback = callback || function () {};
    var killTree = true;
    if(killTree) {
        psTree(pid, function (err, children) {
            [pid].concat(
                children.map(function (p) {
                    return p.PID;
                })
            ).forEach(function (tpid) {
                try { process.kill(tpid, signal) }
                catch (ex) {}
                finally {
                    if (tpid !== pid) {
                        // console.info('PROCESS %d KILLED', tpid);
                    }
                }
            });
            if (!err) {
                // console.info('PROCESS %d KILLED', pid);
            }
            callback(pid);
        });
    } else {
        try { process.kill(pid, signal) }
        catch (ex) { }
        finally {
            // console.info('PROCESS %d KILLED', pid);
        }
        callback(pid);
    }
};

function killProcessById(pid, signal, callback) {
    var isWin = /^win/.test(process.platform);
    if(!isWin) {
        killProcess(pid, signal, callback);
    } else {
        var cp = require('child_process');
        cp.exec('taskkill /PID ' + pid + ' /T /F', function (error, stdout, stderr) {
            // console.log('stdout: ' + stdout);
            // console.log('stderr: ' + stderr);
            // if(error !== null) {
            //      console.log('exec error: ' + error);
            // }
        });
    }
}

module.exports = {
    killProcessById: killProcessById,
    killProcess:killProcess
};
