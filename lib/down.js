const fs = require('fs-extra');
const child_process = require('child_process');
const os = require('os')
const path = require('path')
const download = require('download-git-repo')
const ora = require('ora');
// const zip = require('zip');
// const archiver = require('archiver');
const request = require('request');
const unzip = require('unzip2');
const zlib = require('zlib');
const shell = require('shelljs');
const config = require(process.cwd() + "/bin/config.json");


async function down(name, options) {



    //判断TimeKey是否存在
    var TimeKey = ""
    if (!!fs.existsSync(process.cwd() + '/temp.json')) {

        const temp = fs.readJsonSync(process.cwd() + '/temp.json')
        TimeKey = temp.time_key

    }
    console.log('key', TimeKey)

    var json =
    {
        "sv_params": {
            "timeKey": TimeKey,
            "userId": config.user_id,
            "projectId": config.project_id,
            "appId": config.app_id
        },
        "sv_header": {
            "p_code": config.p_code,
            "sv_method": "engine.doLocalDown"
        }
    }
    //客户端发起请求

    request.post(
        config.server_url, { json },
        function (error, response, body) {
            // console.log("key", TimeKey)
            // console.log(body)
            if (body.retCode === "10000") {
                //如果返回的timekey跟本地的key对比相同时不做下载处理



                if (JSON.parse(body.retData).type === "incre" && !JSON.parse(body.retData).timeKey) {
                    console.log("无更新的文件！");
                    return;
                }

                //如果是全量增加，删除SRC文件夹
                if (JSON.parse(body.retData).type === "global") {
                    fs.removeSync(process.cwd() + 'workspace/src')
                }
                const zipFileId = JSON.parse(body.retData).fileId + ".zip" //压缩包名字

                console.log("下载路径", JSON.parse(body.retData).fileUrl)
                request(JSON.parse(body.retData).fileUrl)   

                    .pipe(fs.createWriteStream(zipFileId)).on('close', function () {
                        console.log("下载完成")
                        if (!fs.existsSync(process.cwd() + '/' + zipFileId)) return;
                        let unzip_extract = unzip.Extract({ path: process.cwd() + '/workspace/src' });

                        unzip_extract.on('error', (err) => {
                            console.log("解压ZIP时遇到错误", err)
                        });
                        //监听解压缩、传输数据结束
                        unzip_extract.on('close', () => {
                            console.log("写入成功")
                            //如果是全局，就启动服务

                            // console.log(JSON.parse(body.retData).type)
                            // console.log("传入参数",options)
                            if (JSON.parse(body.retData).type === "global" && options.preset === "serve") {
                                //启用命令
                                shell.exec("npm run preview");
                            }

                            //写入临时变量
                            fs.writeJson(process.cwd() + '/temp.json', { time_key: `${JSON.parse(body.retData).timeKey}` })
                                .then(() => {
                                    console.log('写入变量成功!')

                                })
                                .catch(err => {
                                    console.error(err)
                                })
                  
                            fs.remove(process.cwd() + '/' + zipFileId)
                        });

                        fs.createReadStream(process.cwd() + '/' + zipFileId).pipe(unzip_extract);


                    })




            }
        }
    );


}

module.exports = (...args) => {

    //判断配置文件的值是否符合规范
    console.log("config")


    //首次启动删除临时文件
    //fs.remove(process.cwd() + '/temp.json');

    //轮询访问服务
    setInterval(() => {
       // fs.remove(process.cwd() + '/temp.json');
        down(...args).catch(err => { process.exit(1) })
    }, 11000)


}