const { getVtt } = require('./vtt/vtt');
const renderFrames = require('./rendering/render-frames');
const renderVideo = require('./rendering/render-video');
const fs = require('fs');
const shell = require('shelljs');

module.exports = {
  execute,
};

async function execute(hereThisFolder, backgroundFile, outputFile) {
  try {
    let vttFilePath = await getVtt(hereThisFolder);
    let framesFolder = await renderFrames.render(vttFilePath, backgroundFile);
    let videoPath = await renderVideo.renderToVideo(
      framesFolder,
      hereThisFolder,
      outputFile,
    );
    shell.rm('-rf', framesFolder);
    return videoPath;
  } catch (err) {
    console.warn('Failed to generate karaoke file', err, typeof err);
    return err;
  }
}

// (function () {
//     execute('/home/hahnkev/hereThisProjects/ENT/Mark/1', './src/rendering/bunny.jpeg');
// })();
