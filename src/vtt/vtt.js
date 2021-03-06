const path = require('path');
const process = require('process');
const shell = require("shelljs");
const {setupFfmpeg} = require('../ffmpeg');

module.exports = {
    getVtt,
    getHearThisInLyricFormat
};

const TMP = '/home/hahnkev/hearThisProject/ENT/Mark/1';
const VTT_BINARY = process.platform == 'win32' ? 'convertHearThis.exe' : 'convertHearThis';
const VTT_BINARY_PATH = path.join(process.cwd(), 'binaries', VTT_BINARY);
async function getVtt(chapterPath) {
    return getHearThisInLyricFormat(chapterPath, 'vtt');
}

async function getHearThisInLyricFormat(chapterPath, format, splitOnWords) {
    let outputFileName = 'tmp';
    let ffmpegPath = path.join(await setupFfmpeg(), 'ffmpeg');
    let execCmd = `${VTT_BINARY_PATH} "${chapterPath}" ${outputFileName} -f "${ffmpegPath}" -o ${format} ${splitOnWords ? '-w' : ''}`;
    console.log('binary: ', execCmd);
    //todo this is  broken
    let result = shell.exec(execCmd);
    if (result.code != 0) {
        console.log('Program output:', result.stdout);
        console.log('Program stderr:', result.stderr);
        throw new Error(result.stderr);
    }
    
    return outputFileName + '.' + format;
}