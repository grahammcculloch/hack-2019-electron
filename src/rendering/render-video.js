const util = require('util');
const path = require('path');
const process = require('process');
const ffbinaries = require('ffbinaries');
const bbkFfmpeg = require('bbk/lib/commands/ffmpeg').run;
const exec = util.promisify(require('child_process').exec);

module.exports = {
    renderToVideo
};
(function (params) {
    renderToVideo('./output', 'audio', 'video.mp4');
})();
async function renderToVideo(imagesFolder, audioFolder, outputFile) {
    let ffmpegFolder = await setupFfmpeg();
    let ffmpegPath = path.join(ffmpegFolder, 'ffmpeg');
    await bbkFfmpeg({
        images:imagesFolder,
        audio: audioFolder,
        output: outputFile,
        ffmpegPath: ffmpegPath
    });
    // console.log(stdout);
}

async function setupFfmpeg() {
    let dest = path.join(process.cwd(), 'binaries');
    await new Promise(function setupCallback(accept, reject) {
        ffbinaries.downloadBinaries(['ffmpeg', 'ffprobe'], {quiet: true, destination: dest}, function () {
            console.log('Downloaded ffmpeg binaries to ' + dest + '.');
            accept();
          });
    });
    return dest;
}
