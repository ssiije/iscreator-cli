const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const download = require('download-git-repo')
const ora = require('ora');
var shell = require('shelljs');

async function create(projectName, options) {
    const spinner = ora('正在下载基础工程...');
    
    spinner.start();
    //init
    download('ssiije/iscreator', process.cwd(), function (err) {
        if (err) {
            spinner.fail();
            console.log("遇到了不可预料的错误，请重试！", chalk.red(err));
        } else {
           
            spinner.text = `基础工程下载完成!`;
            spinner.succeed();
            const nodemodule = ora('正在下载依赖包...');
            // setTimeout(()=>{
            //     nodemodule.text = `hi!我代码还没写呢，先执行 <npm  run allpack>  命令行吧！`;
            //     nodemodule.info()
            // },1000)
           
            nodemodule.start();
            shell.exec("npm run allpack");
            nodemodule.succeed();


        }
    })



}

module.exports = (...args) => { create(...args).catch(err => { process.exit(1) }) }