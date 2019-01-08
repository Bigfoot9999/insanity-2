let uglify = require('uglify-js')

var fs = require('fs');

const minify = async () => {
    let raw = await fs.readFileSync('game/filler.js', 'utf8');
    console.log('1')
    let data = await uglify.minify(raw.toString())
    console.log(data)
}

minify()