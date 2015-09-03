var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');

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
