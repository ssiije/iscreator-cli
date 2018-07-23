 
const path = require('path')
 var shell = require('shelljs');

async function init(projectName, options) {
  console.log('正在安装预览所需要的环境....');

  shell.exec("npm install iscreator -g");
  shell.exec("npm install yarn -g");
  
  console.log("安装完成")



}

module.exports = (...args) => { init(...args).catch(err => { process.exit(1) }) }