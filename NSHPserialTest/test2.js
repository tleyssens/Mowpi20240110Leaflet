const { execFile } = require('child_process');

runShellScript('/home/pi/MowPi59_3B2a/startFlepos.sh')


function runShellScript(filename) {
    var child = execFile(filename, [], (error, stdout, stderr) => {
            if (error) {
                throw error;
            }
            console.log(`${filename} uitgevoerd`)
        });
}