const bbkTiming = require('bbk/lib/commands/timing').run;
const renderFrames = require('./rendering/render-frames');
const renderVideo = require('./rendering/render-video');
const tempy = require('tempy');
const path = require('path');
const shell = require('shelljs');

module.exports = {
  execute,
};

async function execute(hearThisFolder, backgroundFile, font, outputFile) {
  try {
    const outputJsFile = tempy.file({extension: 'js'});
    await bbkTiming({input: path.join(hearThisFolder, 'info.xml'), output: outputJsFile });
    let framesFolder = await renderFrames.render(outputJsFile, backgroundFile, font);
    const result = await renderVideo.renderToVideo(
      framesFolder,
      hearThisFolder,
      outputFile,
    );
    console.log('Result of renderToVideo', result);
    // shell.rm('-rf', framesFolder);
    return outputFile;
  } catch (err) {
    console.warn('Failed to generate karaoke file', err, typeof err);
    return err;
  }
}