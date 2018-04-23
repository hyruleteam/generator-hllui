# generator-hllui
> A Yeoman generator for HLLUI

[![HLLUI Team Name](https://img.shields.io/badge/Team-HLLUI-orange.svg?style=flat)](https://github.com/wenyuking)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://opensource.org/licenses/MIT "Feel free to contribute.")

## Installation

First, install [Yeoman](http://yeoman.io) and generator-hllui using [npm](https://www.npmjs.com/) (we assume you have
pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-hllui
```

Then generate your new project on your target directory:

```bash
yo hllui
```

## About Sprites

You can use the `gulp.spritesmith` to generate spritesheet,We added a can generate multiple pictures of parameters.

You have to put your image files in `./hllui/images/sprites/`,A sprite images corresponds to a folder

```bash
gulp sprites --name <name>
```

## License

MIT
