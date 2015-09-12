#!/bin/bash
mydir="$(dirname "$BASH_SOURCE")"
cd "$mydir/.."
sudo npm install -g gulp
sudo npm install --save-dev gulp
sudo npm install --save-dev gulp-nunjucks-render