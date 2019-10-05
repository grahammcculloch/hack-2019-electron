const { record } = require('./record');
const fs  = require('fs');
const ffbinaries = require('ffbinaries');
const vttToJson = require('vtt-json');
const DataURI = require('datauri').promise;

(async function mainIIFE() {
    try {
        await render('./sample.vtt', './bunny.jpeg');
    } catch (error) {
        console.error(error);
    }
})();

async function render(vttFilePath, bgImagePath) {
    let fps = 30;
    // let ffmpegLocation = await setupFfmpeg();
    let htmlContent = await getHtmlPage(vttFilePath, bgImagePath, fps);
    // fs.writeFileSync('test.html', htmlContent);
    // return;
    await record({
        browser: null, // Optional: a puppeteer Browser instance,
        page: null, // Optional: a puppeteer Page instance,
        // ffmpeg: ffmpegLocation,
        logEachFrame: true,
        output: 'output',
        fps,
        frames: fps * 5, // 5 seconds at 60 fps
        prepare: async function (browser, page) {
            await page.setContent(htmlContent);
        },
        render: async (browser, page, frame) => { 
            await page.evaluate(() => renderNextFrame());
        }
    });
}

async function getHtmlPage(vttFilePath, bgImagePath, fps) {
    let htmlContent = fs.readFileSync('./render.html', {encoding: 'utf-8'});
    let vttContent = fs.readFileSync(vttFilePath, {encoding: 'utf-8'});
    let vttJson = await vttToJson(vttContent);
    let backgroundDataUri = await DataURI(bgImagePath);
    return htmlContent.replace('<!-- replaced-HACK -->', `
    <script>
        let fps = ${fps};
        let vttContent = ${JSON.stringify(vttJson)};
        let backgroundDataUri = '${backgroundDataUri}';
        window.onload = function () {
            window.afterLoadKar(vttContent, backgroundDataUri, fps);
        }
    </script>
    `);
}

async function setupFfmpeg() {
    let dest = __dirname + '/binaries';
    await new Promise(function setupCallback(accept, reject) {
        ffbinaries.downloadBinaries(['ffmpeg', 'ffprobe'], {quiet: true, destination: dest}, function () {
            console.log('Downloaded ffmpeg binaries to ' + dest + '.');
            accept();
          });
    });
    return dest;
}
