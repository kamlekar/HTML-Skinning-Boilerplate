#!/bin/bash
mydir="$(dirname "$BASH_SOURCE")"
cd "$mydir/.."
npm install -g gulp
npm install --save-dev gulp
npm install --save-dev gulp-nunjucks-render
npm install --save-dev gulp-svgstore
npm install --save-dev gulp-svgmin
npm install --save-dev gulp-path
