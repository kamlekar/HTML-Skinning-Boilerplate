#!/bin/bash
#untested code
mydir="$(dirname "$BASH_SOURCE")"
#jumping to the project directory (two steps back)
cd "$mydir/../.."
npm install
