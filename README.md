

##HTML Skinning Boilerplate

This Boilerplate will be useful for the developers who convert images (PSDs) to HTML. This uses sass, gulp and [gulp-nunjucks-render](https://github.com/carlosl/gulp-nunjucks-render).

###Advantages:

- Obeys [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) concept for both css and html.
- No need to run any web server (_optional_).
- Later, you can use the same setup to create a single page application based on [nunjucks](https://mozilla.github.io/nunjucks/) template engine. (_in that case, don't use gulp_)

###How it is useful?

- The css styles can be written in sass in the mentioned "sass" folder and also the html templates can be written in "templates" folder. 
- These `.scss` files and `.html` files will be coverted in to `.css` and `.html` files(_like pages_) and stored in `site` named directory.
- This setup can be used to create svg sprite-sheet. (_check gulpfile.js code_).
- Later, you can share the `site` directory with the client which has css and html files only.

###How it works?

- To write sass, you can refer [sass documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html).
- To write in `nunjucks` template, you can refer [nunjucks documentation](https://mozilla.github.io/nunjucks/).
- The whole setup runs on gulp, which I tried to explain in this [link](http://stackoverflow.com/a/32228623/1577396)
- Using [gulp-svgstore](https://github.com/w0rm/gulp-svgstore), I wrote a small code in `gulpfile.js` which will be helpful to create svg sprite-sheet.

> Note: _you can also write css in `.scss` files if you aren't aware of sass and same applies to nunjucks templating. if that is the case, then this boilerplate is not useful for you._

###Installation:

This Boilerplate depends on [nodejs](https://nodejs.org/download/) (_for templating_) and [ruby](https://www.ruby-lang.org/en/downloads/) (_for sass_). 
- To install on windows, run `installer.bat` from `win-build` folder.
- To install on mac, run `installer.command` from `mac-build` folder.

###Usage:

The `.scss` and `template/*.html` files need to be watched for changes. To watch continuously, you need to run `win-build/runner.bat` file from Windows or `mac-build/runner.command` file from Mac OSX.

###References:

Very nice articles to know about SVG Spritesheets

- [Inline SVG vs Icon Fonts](https://css-tricks.com/icon-fonts-vs-svg/)
- [An Overview of SVG Sprite Creation Techniques](https://24ways.org/2014/an-overview-of-svg-sprite-creation-techniques/)
- [Styling SVG <use> Content with CSS](http://tympanus.net/codrops/2015/07/16/styling-svg-use-content-css/)

PS: Contributors are welcome :)
