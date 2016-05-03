## How SVGs are grouped to one SVG?

SVGs are grouped using [gulp-svgstore](https://github.com/w0rm/gulp-svgstore) plugin.

- First, all svg files are placed inside `bundle-svgs/` folder.
- The SVG files which need to be grouped are mentioned inside `config.json` file, under property `svg-grouping` as shown example below:

#### config.json

    {
        "svg-grouping": {
            "home":       ["logo", "edit", "delete"],
            "contact-us": ["logo", "contact", "profile"]
        }
    }

The above config settings will generate two SVG grouped files with name `home.svg` and `contact-us.svg` in `site/assets/images/` folder.

### Usage:

Based on project, we can include the Grouped SVG in two types:

- Dynamic SVG grouping: Here, the grouped SVG is included dynamically through JavaScript Ajax call. Here is the [code](https://github.com/kamlekar/HTML-Skinning-Boilerplate/blob/master/templates-pre/variables/_svg-sprite-method-one.html) which handles this. By default, the boilerplate will include SVG using this method. Here is the [code](https://github.com/kamlekar/HTML-Skinning-Boilerplate/blob/master/templates-pre/sections/_skeleton-content.html#L17) which calls this method.
- Static SVG grouping: Here, the grouped SVG is included in HTML before runtime using gulp. Here is the [code](https://github.com/kamlekar/HTML-Skinning-Boilerplate/blob/master/templates-pre/variables/_svg-sprite-method-two.html) which handles this.
