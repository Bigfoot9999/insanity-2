const browserSync = require('browser-sync')

// Broser sync to serve the site
browserSync({server: true, files: "./index.html"}, function(err, bs) {
    console.log(bs.options.getIn(["urls", "local"]))
})