#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs')

const program = require('commander')

program
    .version(require('../package').version)
    .usage('<command> [options]')
program
    .command('init <app-name>')
    .description('npx初始化安装')
    .option('-p, --preset <presetName>', '预留配置')
    .action((name, cmd) => {
        require('../lib/init.js')(name, cleanArgs(cmd))
    })
program
    .command('create <app-name>')
    .description('创建基础工程')
    .option('-p, --preset <presetName>', '跳过提示并使用已保存或远程预置')

    .action((name, cmd) => {
        require('../lib/run')(name, cleanArgs(cmd))
    })
program
    .command('down <app-name>')
    .description('下载默认')
    .option('-p, --preset <presetName>', '跳过提示并使用已保存或远程预置')

    .action((name, cmd) => {
        require('../lib/down.js')(name, cleanArgs(cmd))
    })

program.parse(process.argv)

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
    const args = {}
    cmd.options.forEach(o => {
        const key = o.long.replace(/^--/, '')
        // if an option is not present and Command has a method with the same name
        // it should not be copied
        if (typeof cmd[key] !== 'function') {
            args[key] = cmd[key]
        }
    })
    return args
}