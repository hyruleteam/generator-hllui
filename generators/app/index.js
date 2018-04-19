'use strict';

// 加载 yeoman generator 的核心功能模块.
const Generator = require('yeoman-generator');
// 加载文件读写模块.
const fs = require('fs');
// 加载路径模块
const path = require('path');
// 加载输出模块
const chalk = require('chalk');
//加载yeoman语言输出模块
const yosay = require('yosay');
//加载命令行信息输出
const gutil = require('gulp-util');

/**
 * Base Module
 */
module.exports = class extends Generator{

	constructor(args,opts){
		super(args,opts);

	    this.name = path.basename(process.cwd());
	    this.author = "Jacobwang";
	    this.description = '';
	    this.type = '';
	}

	initializing() {
	    this.log(yosay('欢迎使用全网数商前端 ' + chalk.red('QWUI') + ' 项目生成器!'));
	}

	prompting(){
		return this.prompt([{
                type: 'input',
                name: 'name',
                message: '请输入项目名称:',
                default: this.name
            }, {
                type: 'input',
                name: 'description',
                message: '请输入项目描述:',
                default: this.description
            }, {
                type: 'input',
                name: 'author',
                message: '请输入开发人员:',
                default: this.author
            },{
                type: 'list',
                name: 'type',
                message: '请选择项目类型:',
                choices: [
			      '移动端',
			      'PC端'
			    ]
            }]).then((answers) => {

	      	  this.name = answers.name;
              this.pkgName = answers.name;
              this.author = answers.author;
              this.description = answers.description;
              this.type = answers.type;
	    });
	}


	writing(){
		let _self = this;

		gutil.log(gutil.colors.green('QWUI Install: ') + '写入项目结构');

		fs.mkdirSync('dist');

		if(this.type == '移动端'){
			gutil.log(gutil.colors.green('QWUI Install: ') + '安装移动端初始项目');
			this.spawnCommandSync('git', ['clone', 'git@github.com:wenyuking/qwui_mobile.git']);

		    _self.copyFile();
		    _self.doDeleteFile('qwui_mobile');
		}else if(this.type == 'PC端'){
			gutil.log(gutil.colors.green('QWUI Install: ') + '安装PC端初始项目');
			this.spawnCommandSync('git', ['clone', 'https://github.com/wenyuking/qwui.git']);
			_self.copyFile();
		    _self.doDeleteFile('qwui_mobile');
		}

	}

	copyFile(){
		let data = {
			name:this.name,
			description:this.description,
			author:this.author
		}

		this.fs.copy(
	      this.templatePath("ignore"),
	      this.destinationPath(".gitignore")
	    );

	    this.fs.copyTpl(
	      this.templatePath('package.json'),
	      this.destinationPath('package.json'),
	      data
	    );

	    if(this.type == '移动端'){
			this.fs.copy(
		      this.templatePath("gulpfile_mobile.js"),
		      this.destinationPath("gulpfile.js")
		    );
	    }else if(this.type == 'PC端'){
	    	this.fs.copy(
		      this.templatePath("gulpfile.js"),
		      this.destinationPath("gulpfile.js")
		    );
	    }

	    
	}
	
	
	doDeleteFile(folderName){
		this.fs.delete(
		      this.destinationPath(folderName+'/.git/')
		    );
	}

	install() {
	   this.installDependencies({
	      npm: true,
	      bower:false,
	      callback: function() {
	        this.spawnCommand('gulp', ['qwui']);
	      }.bind(this)
	    });
	}
}