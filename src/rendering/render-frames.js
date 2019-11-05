const { record } = require('./record-frames');
const fs = require('fs');
const tempy = require('tempy');
const DataURI = require('datauri').promise;

module.exports = { render };

const fontPlaceholder = 'CAPTION_FONT_FAMILY';
const fallbackFont = 'Helvetica Neue, Helvetica, Arial, sans-serif';

async function render(timingFilePath, bgImagePath, font) {
    let fps = 30;
    // let ffmpegLocation = await setupFfmpeg();
    let htmlContent = await getHtmlPage(timingFilePath, bgImagePath, fps, font);
    // fs.writeFileSync('renderedAnimation.html', htmlContent);
    
    let outputLocation = tempy.directory();

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

async function getHtmlPage(timingFilePath, bgImagePath, fps, font) {
    let htmlContent = fs.readFileSync('./src/rendering/render.html', { encoding: 'utf-8' });
    let timings = fs.readFileSync(timingFilePath, { encoding: 'utf-8' });

    let backgroundDataUri = null;
    if (bgImagePath) {
        backgroundDataUri = await DataURI(bgImagePath);
    }
    return htmlContent.replace('<!-- replaced-HACK -->', `
    <script>
        let fps = ${fps};
        let timing = ${timings};
        let backgroundDataUri = '${backgroundDataUri}';
        window.onload = function () {
            window.afterLoadKar(timings, backgroundDataUri, fps);
        }
    </script>
    `).replace(fontPlaceholder, font || fallbackFont);
}