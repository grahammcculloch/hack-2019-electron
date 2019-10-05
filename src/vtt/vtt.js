const path = require('path');
const process = require('process');
const shell = require("shelljs");
const {setupFfmpeg} = require('../ffmpeg');

module.exports = {
    getVtt
};

const TMP = '/home/hahnkev/hereThisProject/ENT/Mark/1';
const VTT_BINARY_PATH = path.join(process.cwd(), 'binaries', process.platform == 'win32' ? 'convertHereThis' : 'convertHereThis.exe');
async function getVtt(chapterPath) {
    let outputFileName = 'tmp.vtt';
    let ffmpegPath = path.join(await setupFfmpeg(), 'ffmpeg');
    let result = shell.exec(`${VTT_BINARY_PATH} ${chapterPath} tmp -f ${ffmpegPath} -o vtt`);
    if (result.code != 0) {
        console.log('Program output:', result.stdout);
        console.log('Program stderr:', result.stderr);
        throw new Error(result.stderr);
    }
    
    return outputFileName;
}

(function () {
    getVtt('', TMP);
})();