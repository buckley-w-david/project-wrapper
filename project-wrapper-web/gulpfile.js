/// <binding BeforeBuild='dev' ProjectOpened='dev' >
"use strict"
var babel = require("gulp-babel"),
    bundleconfig = require("./bundleconfig.json"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    del = require("del"),
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    merge = require("merge-stream"),
    uglify = require("gulp-uglify"),
    replace = require("gulp-replace-task"),
    argv = require("yargs").argv,
    fs = require("fs");

require("@babel/preset-env");
require("@babel/core");

var regex = {
    htmlSite: /^html:site$/,
    jsSite: /^js:site$/,
    scssSite: /^scss:site$/
}

// Get the environment from the command line
var env = argv.env || 'local';

// Read the settings from the right file
var filename = `env.config.${env}.json`;
var settings = JSON.parse(fs.readFileSync(filename, 'utf8'));

gulp.task("clean", function() {
    var minifiedFiles = bundleconfig.map(function (bundle) {
        return bundle.outputFileName;
    });

    del(minifiedFiles);

    var expandedFiles = bundleconfig.map(function (bundle) {
        return bundle.localOutputFileName;
    });

    return del(expandedFiles);
});

// JS
gulp.task('max:js', async function() {
    merge(getBundles(regex.jsSite).map(bundle => {
        return gulp.src(bundle.inputFiles, { base: '.' })
            .pipe(concat(bundle.localOutputFileName))
            .pipe(babel({
                "presets": [["@babel/preset-env", { "targets": { "ie": "11" } }]]
            }))
            .pipe(replace({
              patterns: [
                {
                    match: 'ProjectWrapperApi',
                    replacement: settings.ProjectWrapperApi
                }
              ]
            }))
            .pipe(gulp.dest('.'));
    }));
});

gulp.task('min:js', async function() {
    merge(getBundles(regex.jsSite).map(bundle => {
        return gulp.src(bundle.inputFiles, { base: '.' })
            .pipe(concat(bundle.outputFileName))
            .pipe(babel({
                "presets": [["@babel/preset-env", { "targets": { "ie": "11" } }]]
            }))
            .pipe(replace({
              patterns: [
                {
                    match: 'ProjectWrapperApi',
                    replacement: settings.ProjectWrapperApi
                }
              ]
            }))
            .pipe(uglify())
            .pipe(gulp.dest('.'));
    }));
});


// CSS
gulp.task('max:css', async function() {
    merge(
        getBundles(regex.scssSite).map(bundle => {
            return gulp.src(bundle.inputFiles, { base: '.' })
                .pipe(sass())
                .on("error", function (error) { console.log(error.toString()); this.emit("end"); })
                .pipe(concat(bundle.localOutputFileName))
                .pipe(gulp.dest('.'));
        })
    );
});

gulp.task('min:css', async function() {
    merge(
        getBundles(regex.scssSite).map(bundle => {
            return gulp.src(bundle.inputFiles, { base: '.' })
                .pipe(sass())
                .on("error", function (error) { console.log(error.toString()); this.emit("end"); })
                .pipe(concat(bundle.outputFileName))
                .pipe(cssmin())
                .pipe(gulp.dest('.'));
        })
    );
});

// HTML
gulp.task('max:html', async function() {
    merge(getBundles(regex.htmlSite).map(bundle => {
        return gulp.src(bundle.inputFiles, { base: '.' })
            .pipe(concat(bundle.outputFileName))
            .pipe(replace({
              patterns: [
                {
                    match: 'WrapperJS',
                    replacement: bundle.localOutputJSFileName
                },
                {
                    match: 'WrapperCSS',
                    replacement: bundle.localOutputCSSFileName
                },
              ]
            }))
            .pipe(gulp.dest('.'));
    }));
});

gulp.task('min:html', async function() {
    merge(getBundles(regex.htmlSite).map(bundle => {
        return gulp.src(bundle.inputFiles, { base: '.' })
            .pipe(concat(bundle.outputFileName))
            .pipe(replace({
              patterns: [
                {
                    match: 'WrapperJS',
                    replacement: bundle.outputJSFileName
                },
                {
                    match: 'WrapperCSS',
                    replacement: bundle.outputCSSFileName
                },
              ]
            }))
            .pipe(gulp.dest('.'));
    }));
});

gulp.task("max", gulp.series(["clean", "max:css", "max:js", "max:html"]));
gulp.task("min", gulp.series(["clean", "min:css", "min:js", "min:html"]));

gulp.task("dev", gulp.series(["max"]));
gulp.task("prod", gulp.series(["min"]));

gulp.task("watchJS", () => {
    getBundles(regex.jsSite).forEach(
        bundle => gulp.watch(bundle.inputFiles, gulp.series(["max:js"]))
    );
});


gulp.task("watchSCSS", () => {
    getBundles(regex.scssSite).forEach(
        bundle => gulp.watch(bundle.inputFiles, gulp.series(["max:css"]))
    );
});

gulp.task("watchHTML", () => {
    getBundles(regex.htmlSite).forEach(
        bundle => gulp.watch(bundle.inputFiles, gulp.series(["max:html"]))
    );
});


gulp.task('watch', gulp.parallel('watchJS', 'watchSCSS', 'watchHTML'), function(done) {
    done()
});

const getBundles = (regexPattern) => {
    return bundleconfig.filter(bundle => {
        return regexPattern.test(bundle.id);
    });
};
