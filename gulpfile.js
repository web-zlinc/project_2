'use strict';

/*
	利用gulp-sass编译css
		* requie(): 导入模块
 */

var gulp = require('gulp');
var sass = require('gulp-sass');


var path = {
	sass:'./src/web/sass/*.scss',
	js:'./src/web/js/*.js'
}


// 创建一个任务
// 用来编译sass
gulp.task('mySass',function(){
	// 查找文件位置
	gulp.src('./src/web/sass/*.scss') //得到文件流（文件在内存中的状态）

		.pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))	//编译sass文件
		.pipe(gulp.dest('./src/web/css/'))			//输出到硬盘
});


// 监听文件的任务
gulp.task('jtSass',function(){
	// 监听home.scsss文件
	// 如果有修改，则执行compileSass任务
	gulp.watch('./src/web/sass/*.scss',['mySass'])
});


var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
// 合并文件
gulp.task('mergeJS',function(){
	gulp.src(path.js)

			// 合并文件
			.pipe(concat('page.js'))

			// 合并文件后输出（未压缩）
			.pipe(gulp.dest('./dist/js'))

			// 压缩文件
			.pipe(uglify())

			// 改名
			.pipe(rename({ suffix: ".min"}))

			// 输出压缩后的文件
			.pipe(gulp.dest('./dist/js'))

});



gulp.task('default',function(){
	console.log(666);
	console.log(gulp);
})

//运行任务
//命令行输入（项目根目录）：gulp 任务名