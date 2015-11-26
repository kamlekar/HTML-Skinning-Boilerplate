#!/bin/bash
#untested code
mydir="$(dirname "$BASH_SOURCE")"
cd "$mydir/../.."
open sass --watch sass:"site/assets/css" --style expanded
open gulp watch