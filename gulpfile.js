var basePath = {
    bundleSvgs: 'bundle-svgs/',
    sass: 'sass/',
    site: 'site/',
    templatesPre: 'templates-pre/',
    templatesPost: 'templates-post/',
};

var assetsPath = {
    img: 'assets/images/',
    js: 'assets/js/',
    css: 'assets/css/'
};

var dataPath = './' + basePath.site + 'data/';

var gulp = require('gulp');
var data = require('gulp-data');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var nunjucksRender = require('gulp-nunjucks-render');
var postTemplate = require('gulp-nunjucks');
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
        svgObj.push(fs.readFileSync( basePath.site + assetsPath.img + fileName + '.svg', 'utf8'));
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
            .src(basePath.bundleSvgs + this + '/*.svg')
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
            .pipe(gulp.dest(basePath.site+assetsPath.img));
    }.bind(svgs[i]));    
}

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
    var processors = [autoprefixer];
    gulp.src(basePath.sass+'**/*.scss')
        .pipe(sourcemaps.init())
        // TO DO: remove comments while compiling sass to css "sourceComments: false" doesn't work.
        .pipe(sass({outputStyle: 'expanded', sourceComments: false}).on('error', sass.logError))
        .pipe(postcss(processors))
        // For mapping: Don't mention the path to make the mapping inline
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(basePath.site+assetsPath.css));
}
/*****************************************/
/*****Templates pre-rendering function****/
/*****************************************/
function preTemplateChanges(){
    nunjucksRender.nunjucks.configure([basePath.templatesPre], { watch: false });
    // used !(_)*.html to exclude rendering of the files with prefix "_" (underscore)
    return gulp.src(basePath.templatesPre+'**/!(_)*.html')
        .pipe(data(function(){
            return require(dataPath+'data.json')
        }))
        .pipe(nunjucksRender({
            css_path: assetsPath.css,
            js_path: assetsPath.js,
            img_path: assetsPath.img,
            svgs: svgs,
            fs: fs
        }))
        .pipe(prettify({indent_size: 4}))
        // .on('error', swallowError)
        .pipe(gulp.dest(basePath.site);
}
/*********************************************************/
/**** Templates post-rendering/pre-compiling function ****/
/*********************************************************/
function postTemplateChanges(){
    return gulp.src([basePath.templatesPost+'**/*.html'])
    .pipe(postTemplate({
        name: function (file) {
            return path.basename(file.relative, path.extname(file.relative));
        }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(basePath.site+assetsPath.js));
}
// Watches changes of sass and templates
// TO DO: Run template changes and sass changes individually
function watchChanges(){
    preTemplateChanges();
    postTemplateChanges();
    sassChange();
    gulp.watch([basePath.templatesPre+'**/*.html',basePath.templatesPost+'**/*.html',basePath.sass+'**/*.scss'], ['pre-templates','post-templates','sass']);
}

// Tasks
gulp.task('sass', sassChange);
gulp.task('pre-templates', preTemplateChanges);
gulp.task('post-templates', postTemplateChanges);
gulp.task('watch', watchChanges);
