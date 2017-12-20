var gulp         = require('gulp');
var ngTemplates  = require('gulp-angular-templatecache');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var del          = require('del');

gulp.task('scripts', function() {
    return gulp.src(['src/**/*.js'])
        .pipe(concat('softchart.src.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('css', function(){
    return gulp.src(['src/**/*.css'])
        .pipe(concat('softchart.css'))
        .pipe(gulp.dest('dist'));
})

gulp.task('build-prod', ['scripts','css','template'], function() {
    return gulp.src(['build/**/*.js'])
        .pipe(concat('softchart.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('softchart.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('template', function() {
    return gulp.src('src/**/*.html')
        .pipe(ngTemplates({
            module: 'softchart.directive'
        }))
        .pipe(rename('softchart.tpl.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function(cb) {
    del(['build'], cb);
});

gulp.task('production', ['build-prod']);