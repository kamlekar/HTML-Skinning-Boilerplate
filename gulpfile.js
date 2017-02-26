var gulp            = require('gulp');
var sass            = require('gulp-sass');
var postcss         = require('gulp-postcss');
var autoprefixer    = require('autoprefixer');
var mmq             = require('gulp-merge-media-queries');
var nunjucksRender  = require('gulp-nunjucks-render');
var postTemplate    = require('gulp-nunjucks');
var sourcemaps      = require('gulp-sourcemaps');
var prettify        = require('gulp-prettify');
var svgstore        = require('gulp-svgstore');
var gutil           = require('gulp-util');
var folders         = require('gulp-folders');
var svgmin          = require('gulp-svgmin');
var concat          = require('gulp-concat');
var path            = require('path');
var fs              = require('fs');
var rename          = require('gulp-rename');
var config          = require('./config.json');


// Variables

var IMAGES_PATH         = 'site/assets/images/';
var SVGS_SOURCE_PATH    = 'bundle-svgs/';
var SVGS_ALL_PATH       = 'bundle-svgs/**/*.svg';
var SASS_PATH           = 'sass/**/*.scss';
var CSS_PATH            = 'site/assets/css';
var ASSETS_PATH         = "assets/";
var POST_TEMPLATES_PATH = ['templates-post/**/*.html'];
var POST_COMPILED_TEMP  = 'templates.js';
var PRE_TEMPLATES_PATH  = ['templates-pre/'];
var PRE_MAIN_TEMPLATES  = 'templates-pre/**/!(_)*.html';
var PRE_ALL_TEMPLATES   = ['templates-pre/**/*.html'];
var JS_PATH             = 'site/assets/js/';

var removeHtmlExtension = false; // Make it true to remove .html extension from pre compiled html templates

/*****************************************/
/***** SVG sprite creating function ******/
/*****************************************/
// svg group folder names present in "bundle-svgs" folder
// Sometimes there will be need where we use different svg spritesheets for each page
// if you need a common sprite, you can just mention a single folder name
// The below are the example folder names, holding svgs for individual pages.
// We will pass these folder names as array to generate the svg sprite-sheet.
var svgs = [];
// var svgObj = [];
// try{
//     for(var j=0;j<svgs.length;j++){
//         var fileName = svgs[j];
//         svgObj.push(fs.readFileSync('site/assets/images/' + fileName + '.svg', 'utf8'));
//     }
// }
// catch(e){
//     console.log(e);
// }

/*****************************************/
/*******SVG precompiling function********/
/*****************************************/
function generateSvg(){
    config = requireUncached('./config.json');
    var svgGrouping = config['svg-grouping'];
    if(svgGrouping){
        try{
            for(var pageName in svgGrouping){
                // storing all page names in svgs global variable
                svgs.push(pageName);

                var pageSpecificSVGs = svgGrouping[pageName]; // Array


                // mapping the page specific variables with relative path
                var newPageSpecificSVGs = pageSpecificSVGs.map(function(p){ return SVGS_SOURCE_PATH + p + '.svg' });
                gulp
                    .src(newPageSpecificSVGs)
                    .pipe(svgmin(function(file){
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
                    .on('error', function(error){
                        gutil.log(error.message);
                    })
                    .pipe(svgstore())
                    // Uncomment the below lines to add additional attributes to the generated SVG Sprite
                    // .pipe(cheerio(function($, file){
                    //     $('svg > symbol').attr('preserveAspectRatio', 'xMinYMid');
                    // }))
                    .on('error', function(error){
                        gutil.log(error.message);
                    })
                    .pipe(rename(pageName + '.svg'))
                    // Store the generated svg sprite in "site/assets/images/" folder
                    .pipe(gulp.dest(IMAGES_PATH));
            }
        }
        catch(ex){
            // This function will break mostly when there are no svgs or svg folders in 'bundle-svgs'
            gutil.log(ex);
        }
    }
};




/*****************************************/
/*******SASS precompiling function********/
/*****************************************/
// TO DO: Keep the compiled css code in expanded mode
function sassChange(){
    var processors = [autoprefixer({
        browsers: ['ie > 9', 'safari > 6']
    })];
    gulp.src(SASS_PATH)
        .pipe(sourcemaps.init())
        // TO DO: remove comments while compiling sass to css "sourceComments: false" doesn't work.
        .pipe(sass({outputStyle: 'expanded', sourceComments: false}).on('error', sass.logError))
        .pipe(mmq({log: true}))
        .pipe(postcss(processors))
        // For mapping: Don't mention the path to make the mapping inline
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(CSS_PATH));
}

function server() {
    try{
        connect.server({
            // port: '8080',
            root: 'site'
        });
    }
    catch(e){
        console.log(e);
    }
}

/*****************************************/
/*****Templates pre-rendering function****/
/*****************************************/
function preTemplateChanges(){
    config = requireUncached('./config.json');
    var slugs = config.slugs;
    nunjucksRender.nunjucks.configure(PRE_TEMPLATES_PATH, { watch: false });
    // use !(_)*.html to exclude rendering of the files with prefix "_" (underscore)
    return gulp.src(PRE_MAIN_TEMPLATES)
        .pipe(nunjucksRender({
            // Custom global variables for pre compiling HTML templates
            css_path: CSS_PATH,
            js_path: JS_PATH,
            lib_path: ASSETS_PATH + "libs/",
            img_path: IMAGES_PATH,
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
        .on('error', function(error){
            gutil.log(error.message);
        })
        .pipe(rename(function(obj){
            if(removeHtmlExtension){
                if(obj.basename !== 'index'){
                    var x = (slugs[obj.basename] || {});
                    values.title = x.title;
                    var slug = x.slug;
                    if(!slug){
                        slug = obj.basename;
                    }
                    obj.dirname = slug;
                    obj.basename = "index";
                }
            }
        }))
        // .on('error', swallowError)
        .pipe(gulp.dest('site'));
}
/*********************************************************/
/**** Templates post-rendering/pre-compiling function ****/
/*********************************************************/
function postTemplateChanges(){
    return gulp.src(POST_TEMPLATES_PATH)
    .pipe(postTemplate({
        name: function (file) {
            return path.basename(file.relative, path.extname(file.relative));
        }
    }))
    .pipe(concat(POST_COMPILED_TEMP))
    .pipe(gulp.dest(JS_PATH));
}
// Watches changes of sass and templates
// TO DO: Run template changes and sass changes individually
function watchChanges(){
    gulp.watch([PRE_ALL_TEMPLATES, 'config.json'],['pre-templates']);
    gulp.watch(POST_TEMPLATES_PATH,['post-templates']);
    gulp.watch(SASS_PATH,['sass']);
    gulp.watch([SVGS_ALL_PATH, 'config.json'],['generate-svg']);
}

// Tasks
gulp.task('sass', sassChange);
gulp.task('pre-templates', preTemplateChanges);
gulp.task('post-templates', postTemplateChanges);
gulp.task('generate-svg', generateSvg);
gulp.task('watch', 
    [
        'generate-svg',  // this should be on top because it fills data in a global variable, svgs
        'pre-templates', 
        'post-templates', 
        'sass'
    ],  watchChanges
);




function requireUncached(module){
    require.cache[require.resolve(module)] = undefined;
    return require(module)
}