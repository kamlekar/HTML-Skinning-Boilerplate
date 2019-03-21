const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const mmq = require('gulp-merge-media-queries');
const htmlCompilers = {
    '.pug': require('gulp-pug'),
    '.html': require('gulp-nunjucks-render')
};
const sourcemaps = require('gulp-sourcemaps');
const prettify = require('gulp-prettify');
const svgstore = require('gulp-svgstore');
const gutil = require('gulp-util');
const svgmin = require('gulp-svgmin');
const connect = require('gulp-connect');
const path = require('path');
const fs = require('fs');
const rename = require('gulp-rename');
const uncss = require('postcss-uncss');
const clean = require('postcss-clean');
const plumber = require('gulp-plumber');
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const data = require('gulp-data');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

let config = require('./config.json');

// Variables

var IMAGES_PATH = 'dist/assets/images/';
var EXT_HTML = ['.pug', '.html'];
var SVGS_SOURCE_PATH = 'bundle-svgs/';
var SVGS_ALL_PATH = 'bundle-svgs/**/*.svg';
var SASS_PATH = 'sass/**/*.scss';
var CSS_PATH = 'dist/assets/css/';
var ASSETS_PATH = "assets/";
var PRE_MAIN_TEMPLATES = (ext) => `templates/**/!(_)*${ext}`;
var PRE_ALL_TEMPLATES = (ext) => `templates/**/*${ext}`;
var ALL_JS_PATH = 'dist/assets/**/*.js';
var JS_PATH = 'dist/assets/js/';
var JS_LIBS_PATH = ['dist/assets/libs/*.js', '!dist/assets/libs/libs.js'];
var JS_LIBS_PATH = 'dist/assets/libs/*.js';
var JS_VENDORS_PATH = 'dist/assets/vendors/*.js';

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

/*****************************************/
/*******SVG precompiling function********/
/*****************************************/
function generateSvg() {
    config = requireUncached('./config.json');
    var svgGrouping = config['svg-grouping'];

    if (svgGrouping) {
        var svgKeys = Object.keys(svgGrouping);
        return Promise.all(
            svgKeys.map(key => {
                var pageSpecificSVGs = svgGrouping[key]; // Array
                // mapping the page specific variables with relative path
                var newPageSpecificSVGs = pageSpecificSVGs.map(p => SVGS_SOURCE_PATH + p + '.svg');
                return gulp
                    .src(newPageSpecificSVGs)
                    .pipe(plumber())
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
                    .pipe(rename(key + '.svg'))
                    // Store the generated svg sprite in "dist/assets/images/" folder
                    .pipe(gulp.dest(IMAGES_PATH))
                    .pipe(browsersync.stream());
            })
        )
    }
    return new Promise((resolve, reject) => resolve({}));
};

/*****************************************/
/*******SASS precompiling function********/
/*****************************************/
// TO DO: Keep the compiled css code in expanded mode
function sassChange() {
    var processors = [
        uncss({
            html: ['dist/**/*.html']
        }),
        // clean(),
        autoprefixer({
            browsers: ['ie > 9', 'safari > 6']
        })
    ];
    return gulp.src(SASS_PATH)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        // TO DO: remove comments while compiling sass to css "sourceComments: false" doesn't work.
        .pipe(sass({ outputStyle: 'expanded', sourceComments: false }))
        .pipe(mmq({ log: true }))
        .pipe(postcss(processors))
        // For mapping: Don't mention the path to make the mapping inline
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(CSS_PATH))
        .pipe(rename({
            suffix: ".min"
        }))
		.pipe(cleanCSS())
		.pipe(gulp.dest(CSS_PATH))
        .pipe(browsersync.stream());
}

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

/*****************************************/
/*****Templates pre-rendering function****/
/*****************************************/
function preTemplateChanges() {
    config = requireUncached('./config.json');
    var slugs = config.slugs;
    return new Promise((resolve, reject) => {
        resolve(EXT_HTML.reduce((acc, ext) => {
            // use !(_)*.html to exclude rendering of the files with prefix "_" (underscore)
            return gulp.src(PRE_MAIN_TEMPLATES(ext))
                .pipe(plumber())
                .pipe(data(function(file){
                    var relative_path = file.path.replace(__dirname + "\\templates", "");
                    var count = relative_path.split("\\").length - 2;
                    var relative_assets_path = Array(count).fill("../").join("") + ASSETS_PATH;
                    // console.log(relative_assets_path);
                    var obj = {
                            // Custom global variables for pre compiling HTML templates
                            css_path:   relative_assets_path + "css/",
                            js_path:    relative_assets_path + "js/",
                            lib_path:   relative_assets_path + "libs/",
                            vendors_path:   relative_assets_path + "vendors/",
                            assets:     relative_assets_path,
                            img_path:   relative_assets_path + "images/",
                            svgs:       svgs,
                            fs:         fs,
                            /* The below setting is used to hide ".html" extension in url paths */
                            /* It will generate a folder with file's name and insert the content in index.html file */
                            /* Example: if you pass "home.html", it will compile to "home/index.html" */
                            // ext: '/index.html'
                    };
                    return obj;
                }))
                .pipe(htmlCompilers[ext]())
                .pipe(prettify({ indent_size: 4 }))
                .pipe(rename(function (obj) {
                    if (removeHtmlExtension) {
                        if (obj.basename !== 'index') {
                            var x = (slugs[obj.basename] || {});
                            values.title = x.title;
                            var slug = x.slug;
                            if (!slug) {
                                slug = obj.basename;
                            }
                            obj.dirname = slug;
                            obj.basename = "index";
                        }
                    }
                }))
                // .on('error', swallowError)
				.pipe(gulp.dest('dist'))
                .pipe(browsersync.stream());
        }))
    })
}

// JS optimization
function jsOptimization() {
    return gulp.src('dist/assets/js/main.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // .pipe(concat('main1.js'))
        // .pipe(gulp.dest(JS_PATH))
        // .pipe(rename({
        //     suffix: ".min"
        // }))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(JS_PATH))
        .pipe(browsersync.stream());
}
// const p = {
//     jsPath: {
//         js: {
//             orig: [JS_LIBS_PATH],
//             dest: [JS_PATH]
//         },
//         js: {
//             orig: [JS_VENDORS_PATH],
//             dest: [JS_PATH]
//         }
//     }
// };
// function jsOptimization(done) {
//     Object.keys(p).forEach(val => {
//         return gulp
//             .src(p[val].js.orig)
//             .pipe(plumber())
//             .pipe(babel({
//                 presets: ['@babel/env']
//             }))
//             .pipe(concat('libs.js'))
//             .pipe(gulp.dest(p[val].js.dest))
//             .pipe(rename({
//                 suffix: ".min"
//             }))
//             .pipe(uglify())
//             .pipe(gulp.dest(p[val].js.dest))
//             .pipe(browsersync.stream());
//     });
//     done();
// };

// images optimization
function imgOptimization() {
    return gulp.src('dist/assets/images/**/*.+(png|jpg|jpeg)')
        .pipe(plumber())
        // Caching images that ran through imagemin
        // .pipe(cache(imagemin({
        //     interlaced: true
        // })))
        .pipe(imagemin({
            interlaced: true
			// progressive: true
			// optimizationLevel: 5
        }))
        // .pipe(cache(imagemin([
        //     imagemin.gifsicle({
        //         interlaced: true
        //     }),
        //     imagemin.jpegtran({
        //         progressive: true
        //     }),
        //     imagemin.optipng({
        //         optimizationLevel: 5
        //     })
            // imagemin.svgo({
            //     plugins: [{
            //             removeViewBox: true
            //         },
            //         {
            //             cleanupIDs: false
            //         }
            //     ]
            // })
        // ])))
        // .pipe(gulp.dest('dist/assets/images'))
        .pipe(gulp.dest(IMAGES_PATH))
        .pipe(browsersync.stream());
};

// Watches changes of sass and templates
function requireUncached(module) {
    require.cache[require.resolve(module)] = undefined;
    return require(module);
}

// TO DO: Run template changes and sass changes individually
function watchChanges() {
	// gulp.watch([PRE_ALL_TEMPLATES(EXT_HTML), 'config.json'],['templates']);
    gulp.watch(SASS_PATH, gulp.series('sass'));
    gulp.watch([SVGS_ALL_PATH, 'config.json'], gulp.series('generate-svg'));
    gulp.watch(IMAGES_PATH, gulp.series('imagemin'));
    gulp.watch(JS_PATH, gulp.series('uglify'));
	gulp.watch(
		EXT_HTML.map((ext) => PRE_ALL_TEMPLATES(ext)).concat('config.json'),
		gulp.series('templates', browserSyncReload)
	)
}

// Tasks
gulp.task('sass', sassChange);
gulp.task('generate-svg', generateSvg);
gulp.task('imagemin', imgOptimization);
gulp.task('uglify', jsOptimization);
gulp.task('templates', preTemplateChanges);
// gulp.task('live', server);

// Dev Tasks
gulp.task('run', gulp.series('generate-svg', 'sass', 'imagemin', 'uglify', 'templates'));
gulp.task('watch', gulp.series('run', watchChanges));
gulp.task("default", gulp.series('run', gulp.parallel('watch', browserSync)));