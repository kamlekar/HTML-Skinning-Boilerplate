### Installation:

Here are some easy installation steps:

- Make sure [nodejs](https://nodejs.org/download/) installed (_for templating, sass and SVG Spritesheet_).
- After installing nodejs, `cd` to the project folder through Command prompt.
- `npm install` (add prefix `sudo` in mac/linux, if necessary).
- `npm install -g gulp`
- `gulp` (_this will watch for changes related to sass, templates, svg spritesheet_)

That's it!! everything is ready now. Always make sure to run `gulp` from your project folder through command prompt, before working on the code.

> Note: Work only on `.scss` and `.pug` files. Don't try to change `.css` and `.html` files in `dist/` folder.

# Compiling HTML and CSS files

To compile HTML and CSS files from PUG and SCSS files, respectively, you can run the following command in Command prompt:

- `gulp run` => To compile the files once
- `gulp watch` => To compile the files everytime there is a change in PUG and SCSS files. (Continuous watcher)