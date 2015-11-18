##Instructions to generate SVG Spritesheet
- Keep all the svg's which need to be generated to one svg sprite sheet in a folder.
- The SVG spritesheet will be generated with the name of folder, containing all svgs.
- To generate svg, cd to `project folder` and run the following command:

    gulp <svg folder name>

For example, if the folder name is "home-sprt", run the command as:

    gulp home-sprt

Before running the above command, add the svg folder name in array provided in `gulpfile.js`.