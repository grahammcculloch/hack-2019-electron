const path = require('path');
const process = require('process');
const bbkFfmpeg = require('bbk/lib/commands/ffmpeg').run;
const {setupFfmpeg} = require('../ffmpeg');

const FFMPEG_EXE = process.platform == 'win32' ? 'ffmpeg.exe' : 'ffmpeg';

module.exports = {
    renderToVideo
};

async function renderToVideo(imagesFolder, audioFolder, outputFile) {
    let ffmpegFolder = await setupFfmpeg();
    let ffmpegPath = path.join(ffmpegFolder, FFMPEG_EXE);
    const args = {
        images:imagesFolder,
        audio: audioFolder,
        output: outputFile,
        ffmpegPath: ffmpegPath
    };
    console.log('calling bkkFfmpeg', args);
    await bbkFfmpeg(args);
}