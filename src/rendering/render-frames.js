const { record } = require('./record-frames');
const fs = require('fs');
const path = require('path');
const process = require('process');
const vttToJson = require('vtt-json');
const {Lrc} = require('./../vtt/lrc');
const DataURI = require('datauri').promise;

module.exports = { render };

const fontPlaceholder = 'CAPTION_FONT_FAMILY';
const fallbackFont = 'Helvetica Neue, Helvetica, Arial, sans-serif';

async function render(lrcFilePath, bgImagePath, testOnly, font) {
    let fps = 30;
    // let ffmpegLocation = await setupFfmpeg();
    let htmlContent = await getHtmlPage(lrcFilePath, bgImagePath, fps, font);
    fs.writeFileSync('renderedAnimation.html', htmlContent);
    if (testOnly) return;
    
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
            await page.setViewport({ width: 720, height: 480 });
            await page.setContent(htmlContent);
        },
        render: async (browser, page, frame) => {
            await page.evaluate(() => {
                //executing in browser
                renderNextFrame();
            });
        }
    });
    return outputLocation;
}

async function getHtmlPage(lrcFilePath, bgImagePath, fps, font) {
    let htmlContent = fs.readFileSync('./src/rendering/render.html', { encoding: 'utf-8' });
    let lrcContent = fs.readFileSync(lrcFilePath, { encoding: 'utf-8' });

    let lrcJson = new Lrc();
    lrcJson.fromLrcString(lrcContent);

    let vttJson = await vttToJson(vttContent);
    let backgroundDataUri = await DataURI(bgImagePath);
    return htmlContent.replace('<!-- replaced-HACK -->', `
    <script>
        let fps = ${fps};
        let vttContent = ${JSON.stringify(lrcJson)};
        let backgroundDataUri = '${backgroundDataUri}';
        window.onload = function () {
            window.afterLoadKar(vttContent, backgroundDataUri, fps);
        }
    </script>
    `).replace(fontPlaceholder, font || fallbackFont);
}