var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var sass = require('gulp-sass');
var hbsfy = require('hbsfy').configure({
    // Activate auto partial generation
    traverse: true
});
var browserSync = require('browser-sync');
var reload = browserSync.reload;

function handleErrors(e) {
    gutil.log(e.message);
    // Keep gulp from hanging on this task
    this.emit('end');
}

function buildScript (watch) {
    var props = {
        entries: ['./app/js/app.js'],
        debug: true,
        transform: [hbsfy]
    };

    // watchify() if watch requested, otherwise run browserify() once
    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    function rebundle() {
        var stream = bundler.bundle();
        return stream
            .on('error', handleErrors)
            .pipe(source('app.js'))
            .pipe(gulp.dest('./app/js/dist'))
            .pipe(reload({stream: true}));
    }

    // listen for an update and run rebundle
    bundler.on('update', function () {
        rebundle();
        gutil.log('are you ready to bundle...');
    });

    // run it once the first time buildScript is called
    return rebundle();
};

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app',
            // App's routes
            routes: {
                '/agenda': './app/data/calendar.json',
                '/agenda/offer': './app/data/service_offer.json'
            }
        },
        middleware: [],
        ghostMode: false,
        ui: false,
        notify: false,
        open: false
    });
});

gulp.task('sass', function () {
    gulp.src('./app/scss/**/*.scss')
        .pipe(sass({sourcemap: true}).on('error', handleErrors))
        .pipe(gulp.dest('./app/css'))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', function () {
    gulp.src('./node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('./app/fonts/'));
});

gulp.task('scripts', function() {
    // this will once run once because we set watch to false
    return buildScript(false);
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['fonts', 'sass','scripts','browser-sync'], function() {
    // gulp watch for style changes
    gulp.watch('./app/scss/**/*.scss', ['sass']);
    gulp.watch('./app/templates/**/*.hbs', ['scripts']);
    // browserify watch for JS changes
    return buildScript(true);
});
