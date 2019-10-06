const path = require('path');
const process = require('process');
const ffbinaries = require('ffbinaries');
module.exports = {setupFfmpeg};
async function setupFfmpeg() {
    let dest = path.join(process.cwd(), 'binaries');
    await new Promise(function setupCallback(accept, reject) {
        ffbinaries.downloadBinaries(['ffmpeg', 'ffprobe'], {quiet: true, destination: dest}, function () {
            //console.log('Downloaded ffmpeg binaries to ' + dest + '.');
            accept();
          });
    });
    return dest;
}
