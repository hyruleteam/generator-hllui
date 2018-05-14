'use strict';

// 加载 yeoman generator 的核心功能模块.
const Generator = require('yeoman-generator');
// 加载文件读写模块.
const fs = require('fs');
// 加载路径模块
const path = require('path');
//加载OS模块
const os = require('os');
// 加载输出模块
const chalk = require('chalk');
//加载yeoman语言输出模块
const yosay = require('yosay');
//加载命令行信息输出
const gutil = require('gulp-util');

/**
 * Base Module
 */
module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this.name = path.basename(process.cwd());
        this.author = this.user.git.name();
        this.installMode = 'npm'
        this.description = '';
        this.type = '';
        this.folderName = ''
    }

    initializing() {
        this.log(yosay('欢迎使用海拉鲁 ' + chalk.red('UI页面') + ' 项目生成器!'));
    }

    prompting() {
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
        }, {
            type: 'list',
            name: 'type',
            message: '请选择项目类型:',
            choices: [
                '移动端',
                'PC端'
            ]
        }, {
            type: 'list',
            name: 'installMode',
            message: '请选择安装方式:',
            choices: [
                'npm',
                'yarn'
            ]
        }]).then((answers) => {
            this.name = answers.name;
            this.pkgName = answers.name;
            this.author = answers.author;
            this.description = answers.description;
            this.type = answers.type;
            this.installMode = answers.installMode;
        });
    }


    writing() {
        let _self = this;

        gutil.log(gutil.colors.green('HLLUI Install: ') + '写入项目结构');

        fs.mkdirSync('dist');

        if (this.type == '移动端') {
            gutil.log(gutil.colors.green('HLLUI Install: ') + '安装移动端初始项目');
            this.folderName = 'hllpage_mobile';
            this.spawnCommandSync('git', ['clone', 'https://github.com/hyruleteam/hllpage_mobile.git']);
            _self.copyFile();
            _self.doDeleteFile();
        } else if (this.type == 'PC端') {
            gutil.log(gutil.colors.green('HLLUI Install: ') + '安装PC端初始项目');
            this.folderName = 'hllpage_pc';
            this.spawnCommandSync('git', ['clone', 'https://github.com/hyruleteam/hllpage_pc.git']);
            _self.copyFile();
            _self.doDeleteFile();
        }

    }

    copyFile() {
        let data = {
            name: this.name,
            description: this.description,
            author: this.author,
            folderName: this.folderName
        }

        this.fs.copy(
            this.templatePath("ignore"),
            this.destinationPath(".gitignore")
        );

        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            data
        );

        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
            data
        );

        this.fs.copyTpl(
            this.templatePath("gulpfile.js"),
            this.destinationPath("gulpfile.js"),
            data
        );
    }


    doDeleteFile() {
    	var folderName = this.destinationPath(this.folderName);

        var exec = require('child_process').exec,
            child;

        if(os.platform() === 'darwin'){
            child = exec('rm -rf .git',{cwd: folderName}, function(err, out) {
                console.log(out);
                err && console.log(err);
            });
        }else if(os.platform() === 'win32'){
            child = exec('rd/s/q .git',{cwd: folderName}, function(err, out) {
                console.log(out);
                err && console.log(err);
            });
        }
    }

    install() {
    	var _self = this;
        this.installDependencies({
            npm: this.installMode == 'npm',
            yarn: this.installMode == 'yarn',
            bower: false,
            callback: function() {
                this.spawnCommand('gulp');
            }.bind(this)
        });
    }
}