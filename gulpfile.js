const {
  src,
  dest,
  series,
  watch
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const include = require('gulp-file-include');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const htmlbeautify = require('gulp-html-beautify');
const uglify = require('gulp-uglify-es').default;

const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminZopfli = require('imagemin-zopfli');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGiflossy = require('imagemin-giflossy');

const sync = require('browser-sync').create();

const html = () => {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlbeautify({
      "indent_with_tabs": true,
      "max_preserve_newlines": 0,
    }))
    .pipe(dest('dist'));
}

const scss = () => {
  return src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 9', 'ie 10'], {
      cascade: true
    }))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'));
}

const js = () => {
  return src(['src/js/**.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('custom.js'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'));
}

const libsJS = () => {
  return src([
      'src/libs/jQuery/jquery-3.6.0.min.js',
      'src/libs/jQuery/jquery-migrate-1.4.1.min.js',
      'src/libs/**/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('libs.js'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'));
}

const libsCSS = () => {
  return src(['src/libs/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(concat('libs.css'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css'));
}

const images = () => {
  return src('src/images/**/*.{gif,png,jpg,svg}')
    .pipe(cache(imagemin([
      //png
      imageminPngquant({
        speed: 1,
        quality: [0.95, 1]
      }),
      imageminZopfli({
        more: true
      }),
      imageminGiflossy({
        optimizationLevel: 3,
        optimize: 3,
        lossy: 2
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      }),
      imagemin.mozjpeg({
        progressive: true
      }),
      imageminMozjpeg({
        quality: 90
      })
    ])))
    .pipe(dest('dist/images'));
}



const favicon = () => {
  return src('src/**.ico').pipe(dest('dist'));
}

const clear = () => {
  return del(['dist/**', '!dist/fonts']);
}

const serve = () => {
  sync.init({
    server: './dist'
  });
  watch('src/**/*.html', series(html)).on('change', sync.reload);
  watch('src/**/*.scss', series(scss)).on('change', sync.reload);
  watch('src/**/*.js', series(js)).on('change', sync.reload);

}

exports.build = (clear, scss, html, js, libsJS, libsCSS, images, favicon);
exports.serve = series(clear, scss, html, js, libsJS, libsCSS, images, favicon, serve);
exports.clear = clear;
exports.images = images;