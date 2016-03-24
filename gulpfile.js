var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var nunjucksRender = require('gulp-nunjucks-render');
var postTemplate = require('gulp-nunjucks');
var sourcemaps = require('gulp-sourcemaps');
var prettify = require('gulp-prettify');
var svgstore = require('gulp-svgstore');
// var cheerio = require('gulp-cheerio');
var gutil = require('gulp-util');
var folders = require('gulp-folders');
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

/*****************************************/
/*******SVG precompiling function********/
/*****************************************/
function generateSvg(){
    svgs = [];  // Initializing
    try{
        return folders('bundle-svgs/', function(folder){
            // 'folders' function will loop over all the folders
            // Storing the folder names in array to use this array to load the svg script
            svgs.push(folder);
            // gutil.log(svgs);
            return gulp
                // looks for each folder inside "bundle-svgs" folder
                .src('bundle-svgs/' + folder + '/*.svg')
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
        })();
    }
    catch(ex){
        // This function will break mostly when there are no svgs or svg folders in 'bundle-svgs'
        gutil.log(ex);
    }
};


var assets_path = "assets/";

/*****************************************/
/*******SASS precompiling function********/
/*****************************************/
// TO DO: Keep the compiled css code in expanded mode
function sassChange(){
    var processors = [autoprefixer];
    gulp.src('sass/**/*.scss')
        .pipe(sourcemaps.init())
        // TO DO: remove comments while compiling sass to css "sourceComments: false" doesn't work.
        .pipe(sass({outputStyle: 'expanded', sourceComments: false}).on('error', sass.logError))
        .pipe(postcss(processors))
        // For mapping: Don't mention the path to make the mapping inline
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('site/assets/css'));
}
/*****************************************/
/*****Templates pre-rendering function****/
/*****************************************/
function preTemplateChanges(){
    nunjucksRender.nunjucks.configure(['templates-pre/'], { watch: false });
    // use !(_)*.html to exclude rendering of the files with prefix "_" (underscore)
    return gulp.src('templates-pre/**/!(_)*.html')
        .pipe(nunjucksRender({
            css_path: assets_path + "css/",
            js_path: assets_path + "js/",
            lib_path: assets_path + "libs/",
            img_path: assets_path + "images/",
            svgs: svgs,
            fs: fs,
            /* The below setting is used to hide ".html" extension in url paths */
            /* It will generate a folder with file's name and insert the content in index.html file */
            /* Example: if you pass "home.html", it will compile to "home/index.html" */
            // ext: '/index.html'
        }))
        .on('error', function(error){
            gutil.log(error.message);
        })
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
    generateSvg();  // this should be on top because it fills data in a global variable, svgs
    preTemplateChanges();
    postTemplateChanges();
    sassChange();
    gulp.watch([
        'templates-pre/**/*.html',
        'templates-post/**/*.html',
        'sass/**/*.scss',
        'bundle-svgs/**/*.svg'
    ], [
        'pre-templates',
        'post-templates',
        'sass',
        'generate-svg'
    ]);
}

// Tasks
gulp.task('sass', sassChange);
gulp.task('pre-templates', preTemplateChanges);
gulp.task('post-templates', postTemplateChanges);
gulp.task('generate-svg', generateSvg);
gulp.task('watch', watchChanges);
