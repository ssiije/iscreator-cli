const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const download = require('download-git-repo')
const ora = require('ora');
var shell = require('shelljs');
const chalk = require('chalk');

async function create(projectName, options) {
    const spinner = ora('正在下载基础工程...');
    spinner.start();
    //如果文件夹有config.json文件备份，稍后覆盖
    const dest_dir = path.join(os.tmpdir(), 'dest-config');
    fs.removeSync(dest_dir);


    if (!!fs.existsSync(path.join(process.cwd(), 'bin/config.json'))) {
        try {
            const sourceFile = path.join(process.cwd(), 'bin')
            fs.mkdirsSync(dest_dir);
            fs.copySync(sourceFile, dest_dir)
        } catch (e) {
            consle.log("【注意】备份config.json失败，需要重新修改配置！")
        }

    }

    //init
    download('ssiije/iscreator', process.cwd(), function (err) {
        if (err) {
            spinner.fail();
            console.log("遇到了不可预料的错误，请重试！", chalk.red(err));
        } else {
            //从临时文件考BIN目录回来
            const sourceFile = path.join(process.cwd(), 'bin')
            console.log(dest_dir)
            console.log(sourceFile)
            fs.copySync(dest_dir, sourceFile)

            spinner.text = `基础工程下载完成!`;
            spinner.succeed();
            const nodemodule = ora('正在下载依赖包...');

            nodemodule.start();
            shell.exec("npm run allpack");
            nodemodule.text = `基础环境初始化完成！`;



            console.log(chalk.blue("============================="))
            console.log(chalk.blue("请在在跟目录配置文件：【bin/config.json】"))
            console.log(chalk.blue("============================="))
            nodemodule.succeed();


        }
    })

}

module.exports = (...args) => { create(...args).catch(err => { process.exit(1) }) }