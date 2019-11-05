const vtt = require('./vtt');
const fs = require('fs');
const {Lrc} = require('./lrc');

(async function test() {
    let resultFile = await vtt.getHearThisInLyricFormat('/home/hahnkev/hearThisProjects/ENT/Mark/1', 'lrc', true);
    let lrcText = fs.readFileSync(resultFile, {encoding: 'utf-8'});
    let lrcClass = new Lrc();
    lrcClass.fromLrcString(lrcText);
    fs.writeFileSync('testLrc.json', JSON.stringify(lrcClass));
    // console.log(lrcClass);
})();