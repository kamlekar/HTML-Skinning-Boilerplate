var gulp = require('gulp');
var sass = require('gulp-sass');
var nunjucksRender = require('gulp-nunjucks-render');
var sourcemaps = require('gulp-sourcemaps');
var prettify = require('gulp-prettify');
var svgstore = require('gulp-svgstore');
// var cheerio = require('gulp-cheerio');
var svgmin = require('gulp-svgmin');
var concat = require('gulp-concat');
var path = require('path');
var fs = require('fs');


/*****************************************/
/***** SVG sprite creating function ******/
/*****************************************/
// svg group folder names present in "bundle-svgs" folder
// Sometimes there will be need where we use different svg spritesheets for each page
// if you need a common sprite, you can just mention a single folder name
// The below are the example folder names, holding svgs for individual pages.
// We will pass these folder names as array to generate the svg sprite-sheet.
// TO DO: Get the file names automatically by reading the files
// var svgs = ['home-sprt', 'about-sprt', 'contact-sprt', 'all-sprt']; 
var svgs = [];
var svgObj = [];
try{
    for(var j=0;j<svgs.length;j++){
        var fileName = svgs[j];
        svgObj.push(fs.readFileSync('site/assets/images/' + fileName + '.svg', 'utf8'));
    }
}
catch(e){
    console.log(e);
}
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
            // Uncomment the below lines to add additional attributes to the generated SVG Sprite
            // .pipe(cheerio(function($, file){
            //     $('svg > symbol').attr('preserveAspectRatio', 'xMinYMid');
            // }))
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
/*****************************************/
/*******SASS precompiling function********/
/*****************************************/
// TO DO: Keep the compiled css code in expanded mode
function sassChange(){
  gulp.src('sass/**/*.scss')
    .pipe(sourcemaps.init())
    // TO DO: remove comments while compiling sass to css "sourceComments: false" doesn't work.
    .pipe(sass({outputStyle: 'expanded', sourceComments: false}).on('error', sass.logError))
    // For mapping: Don't mention the path to make the mapping inline
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('site/assets/css'));
}
/*****************************************/
/*****Templates pre-rendering function****/
/*****************************************/
function preTemplateChanges(){
    nunjucksRender.nunjucks.configure(['templates/'], { watch: false });
    // used !(_)*.html to exclude rendering of the files with prefix "_" (underscore)
    return gulp.src('templates-pre/**/!(_)*.html')
        .pipe(nunjucksRender({
            css_path: assets_path + "css/",
            js_path: assets_path + "js/",
            img_path: assets_path + "images/",
            svgs: svgs,
            fs: fs
        }))
        .pipe(prettify({indent_size: 4}))
        // .on('error', swallowError)
        .pipe(gulp.dest('site'));
}
/*********************************************************/
/**** Templates post-rendering/pre-compiling function ****/
/*********************************************************/
function postTemplateChanges(){
    return gulp.src(['templates-post/**/*.html'])
    .pipe(postTemplate({
        name: function (file) {
            return path.basename(file.relative, path.extname(file.relative));
        }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('site/assets/js/'));
}
// Watches changes of sass and templates
// TO DO: Run template changes and sass changes individually
function watchChanges(){
    preTemplateChanges();
    postTemplateChanges();
    sassChange();
    gulp.watch(['templates-pre/**/*.html','templates-post/**/*.html','sass/**/*.scss'], ['pre-templates','post-templates','sass']);
}

// Tasks
gulp.task('sass', sassChange);
gulp.task('pre-templates', preTemplateChanges);
gulp.task('post-templates', postTemplateChanges);
gulp.task('watch', watchChanges);
