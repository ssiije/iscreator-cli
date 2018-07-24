#!/usr/bin/env node

// const chalk = require('chalk')
// const fs = require('fs')

const program = require('commander')

program
    .version(require('../package').version)
    .usage('<command> [options]')

// program
//     .command('new <name>')
//     .description('初始化项目基础工程')
//     .option('-p, --preset <presetName>', '选项')
//     .option('-o, --option <optionName>', '选项')
//     .action((name, cmd) => {
//         require(process.cwd() + '/scripts/cli-base')(name, cleanArgs(cmd))
//     })


program
    .command('init <name>')
    .description('本地初始化工程环境')
    .option('-p, --preset <presetName>', '选项')
    .option('-o, --option <optionName>', '选项')
    .action((name, cmd) => {
        require(process.cwd() + '/scripts/cli-proj')(name, cleanArgs(cmd))
    })

program
    .command('new <name>')
    .description('创建基础工程')
    .option('-p, --preset <presetName>', '跳过提示并使用已保存或远程预置')
    .action((name, cmd) => {
        require('../lib/cli-base')(name, cleanArgs(cmd))
    })

// program
//     .command('down <app-name>')
//     .description('下载默认')
//     .option('-p, --preset <presetName>', '跳过提示并使用已保存或远程预置')
//     .action((name, cmd) => {
//         require('../lib/down')(name, cleanArgs(cmd))
//     })
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