const vtt = require('./vtt');
const fs = require('fs');
const {Lrc} = require('./Lrc');

(async function test() {
    let resultFile = await vtt.getHereThisInLyricFormat('/home/hahnkev/hereThisProjects/ENT/Mark/1', 'lrc', true);
    let lrcText = fs.readFileSync(resultFile, {encoding: 'utf-8'});
    let lrcClass = new Lrc();
    let lrcJson = lrcClass.fromLrcString(lrcText);
    console.log(lrcJson);
})();