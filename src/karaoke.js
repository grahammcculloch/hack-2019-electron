const {getVtt} = require('./vtt/vtt');
const renderFrames = require('./rendering/render-frames');
const renderVideo = require('./rendering/render-video');
const fs  = require('fs');
const shell = require("shelljs");

module.exports = {
    execute
};

async function execute(hereThisFolder, backgroundFile, outputFile) {
    let vttFilePath = await getVtt(hereThisFolder);
    let framesFolder = await renderFrames.render(vttFilePath, backgroundFile);
    let videoPath = await renderVideo.renderToVideo(framesFolder, hereThisFolder, outputFile);
    shell.rm('-rf', framesFolder);
    return videoPath;
}

// (function () {
//     execute('/home/hahnkev/hereThisProjects/ENT/Mark/1', './src/rendering/bunny.jpeg');
// })();