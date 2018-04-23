const gulp = require('gulp');
const minifyCSS = require('gulp-minify-css');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const merge = require('merge-stream');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');

//编译路径
const devPath = './<%= folderName %>';
const distPath = './dist';

//browser-sync
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: distPath
        },
        port: 8091,
        notify: false, //刷新是否提示
        open: false //是否自动打开页面
    });

});

//html
gulp.task('buildHtml', () => {
    return watch(`${devPath}/html/**/*.html`, () => {
        gulp.src([`${devPath}/html/**/*.html`, `!${devPath}/html/include/*.html`])
            .pipe(plumber())
            .pipe(changed(`${distPath}/html`, {hasChanged: changed.compareContents}))
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest(`${distPath}/html`))
            .pipe(browserSync.stream());
    })
});

//style
gulp.task('buildStyle', () => {
    return watch(`${devPath}/sass/**/*.scss`, () => {
        gulp.src(`${devPath}/sass/*.scss`)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(changed(`${distPath}/css`, {hasChanged: changed.compareContents, extension: '.css'}))
            .pipe(sass().on('error', sass.logError))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(`${distPath}/css`))
            .pipe(browserSync.stream()); //browserSync:只监听sass编译之后的css
    })
});

//js
gulp.task('buildJs', () => {
    return watch(`${devPath}/js/**/*.js`, () => {
        gulp.src([`${devPath}/js/**/*.js`])
            .pipe(plumber())
            .pipe(changed(`${distPath}/js`, {hasChanged: changed.compareContents}))
            .pipe(gulp.dest(`${distPath}/js`))
            .pipe(browserSync.stream());
    })
});

//images
gulp.task('buildImages', () => {
    return watch(`${devPath}/img/**/*`, () => {
        gulp.src([`${devPath}/img/**/*`])
            .pipe(plumber())
            .pipe(gulp.dest(`${distPath}/img`))
            .pipe(browserSync.stream())
    })
});

//sprites
const argv = require('minimist')(process.argv.slice(2));

const spritesMithConfig = {
    imgName: argv.name + '.png',
    cssName: '_' + argv.name + '.scss',
    cssFormat: 'scss',
    algorithm: 'binary-tree',
    imgPath: '../images/sprite/' + argv.name + '.png',
    padding: 10
}

gulp.task('buildSprite', () => {
    const spriteData =
        gulp.src(`${devPath}/images/sprites/${argv.name}/*`)
            .pipe(plumber())
            .pipe(spritesmith(spritesMithConfig));

    spriteData.img.pipe(gulp.dest(`${devPath}/images/sprite`));
    spriteData.img.pipe(gulp.dest(`${distPath}/images/sprite`));
    spriteData.css.pipe(gulp.dest(`${devPath}/sass/module/icon`));
});

//clean
gulp.task('buildClean', () => {
    return gulp.src([`${distPath}`])
        .pipe(plumber())
        .pipe(clean({
            force: true
        }))
});

//devPack
gulp.task('devPack', ['buildStyle','buildHtml','buildJs']);

//buildPack
gulp.task('buildAssets', () => {
    const html = gulp.src([`${devPath}/html/**/*.html`, `!${devPath}/html/include/*.html`])
        .pipe(plumber())
        .pipe(changed(`${distPath}/html`, {hasChanged: changed.compareContents}))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(`${distPath}/html`))
        .pipe(browserSync.stream());

    const styles = gulp.src([`${devPath}/sass/*.scss`])
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${distPath}/css`))

    const pagejs = gulp.src(`${devPath}/js/**/*.js`)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest(`${distPath}/js`));

    const images = gulp.src([`${devPath}/images/**/*`, `!${devPath}/images/sprites/**/*`])
        .pipe(gulp.dest(`${distPath}/images`))

    return merge(styles, pagejs, images,html);
});

gulp.task('buildRevPack', ['buildAssets'], () => {
    const styles = gulp.src([`${distPath}/css/*.css`])
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'last 2 Explorer versions', '> 5%']
        }))
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest(`${distPath}/css/`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`${distPath}/rev/css`))

    return merge(styles);
})

gulp.task('default', ['buildAssets','devPack', 'browser-sync'], () => {
    gulp.watch([
        `${distPath}/**/*.+(css|js|png|jpg|ttf|html)`
    ])
        .on('change', browserSync.reload);
});