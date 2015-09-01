

##HTML Skinning Boilerplate

This Boilerplate will be useful for the developers who convert images (PSDs) to HTML. This uses sass, gulp and [gulp-nunjucks-render](https://github.com/carlosl/gulp-nunjucks-render).

###Advantages:

- Obeys [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) concept for both css and html.
- No need to run any web server (_optional_).
- Later, you can use the same setup to create a single page application based on nunjucks template engine. (_in that case, don't use gulp_)

###How it is useful?

- The css styles can be written in sass in the mentioned "sass" folder and also the html templates can be written in "templates" folder. 
- These `.scss` files and `.html` files will be coverted in to `.css` and `.html` files(_like pages_) and stored in `site` named directory.
- Later, you can share the `site` directory with the client which has css and html files only.

###How it works?

- To write sass, you can refer [sass documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html).
- To write in `nunjucks` template, you can refer [nunjucks documentation](https://mozilla.github.io/nunjucks/).
- The whole setup runs on gulp, which I tried to explain in this [link](http://stackoverflow.com/a/32228623/1577396)

> Note: _you can also write css in `.scss` files if you aren't aware of sass and same applies to nunjucks templating. if that is the case, then this boilerplate is not useful for you._

###Installation:

This Boilerplate depends on [nodejs](https://nodejs.org/download/) (_for templating_) and [ruby](https://www.ruby-lang.org/en/downloads/) (_for sass_). So, first install nodejs and ruby. After that, open command prompt. `cd` to the `<project directory>` , then run the following codes in command prompt.

    npm install gulp -g
    npm install gulp --save-dev
    npm install gulp-nunjucks-render --save-dev

###Usage:

- Open command prompt.
- `cd` to the `<project directory>`
- run `gulp watch` (_this will watch for template changes continuously_)
- Open another command prompt.
- `cd` to the `<project directory>`
- run `sass --watch sass:"site/assets/css" --style expanded`

> **Tip**: If you feel lazy enough to run the above commands every time you start the system, write a batch file.

Make it more awesome by including svg sprites using [**gulp-svgstore**](https://github.com/w0rm/gulp-svgstore)


PS: Contributors are welcome :)
