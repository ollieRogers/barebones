var gulp          =  require('gulp');
var lessSourceMap =  require('gulp-less-sourcemap');
var less          =  require('gulp-less');
var autoprefixer  =  require('gulp-autoprefixer');
var stripdebug    =  require('gulp-strip-debug');
var uglify        =  require('gulp-uglify');
var debug         =  require('gulp-debug');
var rename        =  require('gulp-rename');
var replace       =  require('gulp-replace');
var concat        =  require('gulp-concat');
var notify        =  require('gulp-notify');
var minifycss     =  require('gulp-minify-css');
var plumber       =  require('gulp-plumber');
var gutil         =  require('gulp-util');
var imagemin      =  require('gulp-imagemin');
var jade          =  require('gulp-jade');
var tap           =  require('gulp-tap');
var browsersync   =  require('browser-sync');
var inlineCss     =  require('gulp-inline-css');
var minifyHTML    =  require('gulp-minify-html');
var imagemin      =  require('gulp-imagemin');
var pngquant      =  require('imagemin-pngquant');
var fs            =  require('fs');



// Browser definitions for autoprefixer
var AUTOPREFIXER_BROWSERS = [
    'last 2 versions'
];


// error function for plumber
var onError = function (err) {
    gutil.beep();
    console.log(err);
};






// Compile less files to ./dist
gulp.task('css', function() {
    return gulp.src('src/less/main.less')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(less({ style: 'expanded', }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(rename('build.css'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browsersync.reload({ stream:true }))
        .pipe(notify({ message: 'CSS compiled' }));
});


// Jade task compile all jade files to ./dist
gulp.task('html', function() {

    return gulp.src('./src/jade/pages/**/*.jade')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(jade({
            locals: {
                pretty: false
            }
        }))
        .pipe(rename(function (path) {
            if(path.basename !== 'index'){
                var newDir = path.basename;
                path.dirname = newDir;
                path.basename = "index";
                path.extname = ".html";
            }
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(notify({ message: 'HTML compiled' }));
});


// copy js files to ./dist
gulp.task('js', function(){
    return gulp.src('./src/js/**/*.js')
        .pipe(browsersync.reload({ stream:true }))
        .pipe(gulp.dest('./dist/js'));
});


// copy & compress image files
gulp.task('imgs', function(){
    return gulp.src('./src/img/**/*')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/img'));
});


// browser-sync task for starting a server locally
gulp.task('browser-sync', function() {
    browsersync({
        server: {
            baseDir: "./dist/",
            proxy: "localhost:3000/",
            port:3000
        }
    });
});






// Re-run gulp when a file changes
gulp.task('watch', function() {
    gulp.watch('src/less/**/*.less', ['css',  browsersync.reload ] );
    gulp.watch('src/jade/**/*.jade', ['html', browsersync.reload ] );
    gulp.watch('src/img/**/*',       ['imgs', browsersync.reload ] );
    gulp.watch('src/js/**/*.js',     ['js',   browsersync.reload ] );
});

// run this in dev
gulp.task('dev', ['css', 'html', 'js', 'imgs', 'watch', 'browser-sync']);

// live release
gulp.task('build', ['css', 'html', 'js', 'imgs']);

// the default task (called when you run `gulp` from cli)
gulp.task('default', ['build']);
