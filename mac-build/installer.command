#!/bin/bash
mydir="$(dirname "$BASH_SOURCE")"
cd "$mydir/.."
npm install -g gulp
npm install --save-dev gulp
npm install --save-dev gulp-nunjucks-render