const bbkTiming = require('bbk/lib/commands/timing').run;
const renderFrames = require('./rendering/render-frames');
const renderVideo = require('./rendering/render-video');
const tempy = require('tempy');
const shell = require('shelljs');

module.exports = {
  execute,
};

async function execute(hearThisFolder, backgroundFile, font, outputFile) {
  try {
    const outputJsFile = tempy.file({extension: 'js'});
    await bbkTiming({input: `${hearThisFolder}/info.xml`, output: outputJsFile });
    let framesFolder = await renderFrames.render(outputJsFile, backgroundFile, font);
    console.log('Frames folder', framesFolder);
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

(function () {
    execute('C:\ProgramData\SIL\HearThis\ENT\Mark\1', 'C:\DigiServe\bible-karaoke\cross-blog_orig.jpg', 'Arial', 'output.mp4');
})();
