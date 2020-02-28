const jsdoc2md = require('jsdoc-to-markdown');
const { writeFileSync } = require('fs');

const filePath = __dirname + '/../../game_of_life.js';
const testPath = __dirname + '/test.js';

const docs = jsdoc2md.getJsdocDataSync({
    source: testPath,
    noCache: true
})
console.log(docs);
// .then((data) => {
//     console.log(data);
// })
// .catch(err => {
//     console.log(err);
// });

// writeFileSync('./bin/documentation.md', docs);
