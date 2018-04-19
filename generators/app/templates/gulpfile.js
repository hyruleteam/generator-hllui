var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    fileinclude = require('gulp-file-include'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    spritesmith = require('gulp.spritesmith'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();
gulp.task('browser-sync', function() {
    var files = [
        'qwui/html/**/*.html',
        'qwui/js/*/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "./dist"
        },
        port: 8080,
        notify: false, //刷新是否提示
        open: true //是否自动打开页面
    });
});


gulp.task('style', function() {
    gulp.src('./qwui/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        // .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream()); //browserSync:只监听sass编译之后的css
});

gulp.task('prefixer', function() {
    gulp.src('dist/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'last 2 Explorer versions', '> 5%']
        }))
        .pipe(gulp.dest('./dist/css'))
})

gulp.task('html', function() {
    gulp.src(['qwui/html/*.html', 'qwui/html/*/*.html', '!qwui/html/include/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/html'))
});

gulp.task('js', function() {
    gulp.src(['qwui/js/*/*.js', 'qwui/js/*/*/*.js'])
        .on('error', function(error) {
            // Would like to catch the error here
            console.log(error);
        })
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});

var argv = require('minimist')(process.argv.slice(2));

var spritesMithConfig = {
    imgName: argv.name + '.png',
    cssName: '_' + argv.name + '.scss',
    cssFormat: 'scss',
    algorithm: 'binary-tree',
    imgPath: '../images/sprites/' + argv.name + '.png',
    padding: 8
}

gulp.task('sprite', function() {
    var spriteData = gulp.src('./qwui/images/sprites/' + argv.name + '/*.png').pipe(spritesmith(spritesMithConfig));
    spriteData.img.pipe(gulp.dest("./dist/images/sprites"));
    spriteData.css.pipe(gulp.dest("./qwui/sass/module/icon"));
})

// 执行任务
gulp.task('qwui', function() {

    gulp.run('browser-sync');
    gulp.watch(['qwui/sass/*/*.scss', 'qwui/sass/*/*/*.scss'], ['style']);
    gulp.watch(['qwui/html/**/*.html', ], ['html'])
    gulp.watch(['qwui/js/*/*.js', 'qwui/js/*/*/*.js'], ['js']);
});

gulp.task('prod', function() {

    gulp.watch(['qwui/js/*.js'], ['js']);
    gulp.watch(['qwui/sass/*/*.scss', 'qwui/sass/*/*/*.scss'], ['style']);
    gulp.watch(['qwui/html/*.html', 'qwui/html/*/*.html'], ['html']);
    gulp.watch(['dist/css/*.css'], ['prefixer']);
});
