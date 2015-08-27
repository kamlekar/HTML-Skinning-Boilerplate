var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');

var assets_path = "assets/";

gulp.task('default', function () {
    nunjucksRender.nunjucks.configure(['templates/'], { watch: false });
    return gulp.src('templates/!(_)*.html')
        .pipe(nunjucksRender({
        	css_path: assets_path + "css/",
        	js_path: assets_path + "js/",
        	img_path: assets_path + "images/"
        }))
        .pipe(gulp.dest('site'));
});
gulp.task('watch', function () {
    gulp.watch(['templates/*.html'], ['default']);
});