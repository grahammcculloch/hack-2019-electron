const { record } = require('./record-frames');
const fs  = require('fs');
const path = require('path');
const process = require('process');
const vttToJson = require('vtt-json');
const DataURI = require('datauri').promise;

module.exports = {render};

(async function mainIIFE() {
    try {
        await render('./src/rendering/lrc.json', './src/rendering/testBG.jpg');
    } catch (error) {
        console.error(error);
    }
})();


async function render(vttFilePath, bgImagePath) {
    let fps = 30;
    // let ffmpegLocation = await setupFfmpeg();
    let htmlContent = await getHtmlPage(vttFilePath, bgImagePath, fps);
    fs.writeFileSync('test.html', htmlContent);
    return;
    let outputLocation = fs.mkdtempSync('kar');
    
    await record({
        browser: null, // Optional: a puppeteer Browser instance,
        page: null, // Optional: a puppeteer Page instance,
        // ffmpeg: ffmpegLocation,
        logEachFrame: true,
        output: outputLocation,
        fps,
        frames: fps * 5, // 5 seconds at 60 fps
        prepare: async function (browser, page) {
            await page.setContent(htmlContent);
        },
        render: async (browser, page, frame) => { 
            await page.evaluate(() => renderNextFrame());
        }
    });
    return outputLocation;
}

async function getHtmlPage(vttFilePath, bgImagePath, fps) {
    let htmlContent = fs.readFileSync('./src/rendering/render.html', {encoding: 'utf-8'});
    let vttContent = fs.readFileSync(vttFilePath, {encoding: 'utf-8'});
    // let vttJson = await vttToJson(vttContent);
    let backgroundDataUri = await DataURI(bgImagePath);
    return htmlContent.replace('<!-- replaced-HACK -->', `
    <script>
        let fps = ${fps};
        let vttContent = ${vttContent};
        let backgroundDataUri = '${backgroundDataUri}';
        window.onload = function () {
            window.afterLoadKar(vttContent, backgroundDataUri, fps);
        }
    </script>
    `);
}