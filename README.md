

##HTML Skinning Boilerplate

This is a starter kit for HTML Developers, useful to develop HTMLs faster. This uses [sass](http://sass-lang.com/), [gulp](http://gulpjs.com/) and [gulp-nunjucks-render](https://github.com/carlosl/gulp-nunjucks-render).

###Advantages:

- Obeys [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) concept (_Don't repeat yourself_) for both css and html.
- Manage all svgs as SVG sprite-sheet.
- No need to run any web server (_optional_).
- Later, you can use the same setup to create a single page application based on [nunjucks](https://mozilla.github.io/nunjucks/) template engine. (_in that case, don't use gulp-nunjucks-render_)

###How it is useful?

Suppose, you got a requirement where you just need to develop six HTML pages from the provided images by Designers. There are many common sections which you are copy pasting for each page of HTML files (_let say it is Header_). Later, the client/designer proposed some changes in header part. In that case, you need to change the header part in a page and need to copy paste again in all the six pages. 

And if the changes are frequent in all common sections and there are more pages, it is quite common we miss to change the modified section in a page or two. This boilerplate handles this kind of situations and many more. 

You can also write css faster using sass and create svg sprite-sheet.

###How it works?

- To write sass, you can refer [sass documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html).
- I already implemented common layouting styles in `_mini-bootstrap.scss` file, with comments.
- To write in `nunjucks` template, you can refer [nunjucks documentation](https://mozilla.github.io/nunjucks/).
- The whole setup runs on gulp, which I tried to explain in this [link](http://stackoverflow.com/a/32228623/1577396)
- Using [gulp-svgstore](https://github.com/w0rm/gulp-svgstore), I wrote a small code in `gulpfile.js` which will be helpful to create svg sprite-sheet. **This svg spritesheet works only when run on any web server**

> Note: _you can also write css in `.scss` files if you aren't aware of sass and same applies to nunjucks templating._

###Installation:

Here are some easy installation steps:

- This Boilerplate needs [nodejs](https://nodejs.org/download/) (_for templating and for sass_). So, install it first.
- After installing nodejs, fork/download this repo in your local.
- `cd` to the project folder through CLI.
- `npm install` (add prefix `sudo` in mac, if necessary).

That's it!! everything is ready now.

###Usage

To watch for template and sass changes, `cd` to project directory and then `gulp watch`.

> Note: _if you are doing the above step frequently, you can create a batch extension file. I have given examples for Windows and Mac OS which you can find in win-build and mac-build folders respectively._

###References:

Very nice articles to know about SVG Spritesheets

- [Inline SVG vs Icon Fonts](https://css-tricks.com/icon-fonts-vs-svg/)
- [An Overview of SVG Sprite Creation Techniques](https://24ways.org/2014/an-overview-of-svg-sprite-creation-techniques/)
- [Styling SVG <use> Content with CSS](http://tympanus.net/codrops/2015/07/16/styling-svg-use-content-css/)

PS: Contributors are welcome :)

###FAQ:

#####1) I am getting following error while trying to install node dependencies in command prompt.
> Couldn't install optional dependency: Unsupported
For this Boilerplate, the following fix will work. Check this [link](https://github.com/npm/npm/issues/9204#issuecomment-157653267). 
