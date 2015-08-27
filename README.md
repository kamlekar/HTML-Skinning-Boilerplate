

##HTML Skinning Boilerplate

This Boilerplate will be useful for the developers who convert image (PSDs) to HTML (_without any javascript functionality_). 

This Boilerplate uses sass, gulp and gulp-nunjucks-render.

###Installation:

This Boilerplate depends on nodejs (_for templating_) and ruby (_for sass_). So, first install nodejs and ruby. After that, open command prompt. `cd` to the `<project directory>` , then run the following codes in command prompt.

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

PS: Contributors are welcome :)