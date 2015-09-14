var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');

var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');


// svg group folder names present in "bundle-svgs" folder
var svgs = ['xyz-sprt', 'abc-sprt', 'pqrs-sprt'];
// - CD to the project folder
// - Run "gulp <folder-name>" in CLI to generate the sprite svg
for(var i = 0; i < svgs.length; i++){
    gulp.task(svgs[i], function () {
        return gulp
            // looks for each folder inside "bundle-svgs" folder
            .src('bundle-svgs/' + this + '/*.svg')
            .pipe(svgmin(function (file) {
                var prefix = path.basename(file.relative, path.extname(file.relative));
                return {
                    plugins: [{
                        cleanupIDs: {
                            prefix: prefix + '-',
                            minify: true
                        }
                    }]
                }
            }))
            .pipe(svgstore())
            // Store the generated svg sprite in "site/assets/images/" folder
            .pipe(gulp.dest('site/assets/images/'));
    }.bind(svgs[i]));    
}

var assets_path = "assets/";

/* // Test this function 
   // Intention: Stops from breaking the gulp watch on any error
function swallowError (error) {
    //If you want details of the error in the console
    console.log(error.toString());
    notify(error.toString());
    util.beep();
    this.emit('end');
}
*/
gulp.task('default', function () {
    nunjucksRender.nunjucks.configure(['templates/'], { watch: false });
    return gulp.src('templates/!(_)*.html')
        .pipe(nunjucksRender({
        	css_path: assets_path + "css/",
        	js_path: assets_path + "js/",
        	img_path: assets_path + "images/"
        }))
        // .on('error', swallowError)
        .pipe(gulp.dest('site'));
});
gulp.task('watch', function () {
    gulp.watch(['templates/*.html'], ['default']);
});
