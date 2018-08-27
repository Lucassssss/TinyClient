// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var fs = require('fs')
var inDir = ''
var outDir = ''
const electron = require('electron');
const dialog = electron.remote.dialog;
const {BrowserWindow} = require('electron').remote
const shell = electron.shell
const path = require('path')
let keyListArray = new Array()
var tinify = require("tinify");

// SPQbSkCoryRX-THwv_i8Gz6VT7F6591T
// 0YgtqWq2sMKf9qjUPsdWVvGfqc2zX2JS

checkKey(0)
function checkKey(index) {
    if(index >= 6) {
        addLog('无可用key，“Key 管理” -> “获取 Key”。')
        return
    }
    let localKeyList = localStorage.getItem('keyList')
    if(!localKeyList) {
        addLog('TinyClient 是一个超强压缩图片的小工具，压缩率可以达到 50% 以上，压缩质量接近无损。')
        addLog('首次使用需要申请Key，一个邮箱就可以了。点击 Key 管理/ 获取 Key，即可获得。每个 Key 每月可以压缩 500 张图片，建议多申请几个。')
        return
    }
    localKeyList = localKeyList.split(',')
    // key 验证
    tinify.key = localKeyList[index]
    addLog('开始验证 Key')
    tinify.validate(function (err) {
        if (err) {
            addLog('Key:'+ tinify._key + ' 验证失败，即将尝试下一个')
            setTimeout(()=> {
                checkKey(index + 1)
            }, 3000)
            return
        }
        if(tinify.compressionCount >= 500) {
            addLog('Key:' + tinify._key +' 本月已不可用，即将尝试下一个key')
            checkKey(index + 1)
        } else {
            addLog('Key:' + tinify._key +' 验证成功')
            addLog('当前 Key 本月剩余:' + (500 - tinify.compressionCount) + ' 次' )
            addLog('准备就绪，请选择文件夹(同一目录将会覆盖原图片，请谨慎操作)')
        }
    })   
}

function initList() {
    fs.readdir(inDir, (err, data) => {
        if (err) {
            console.log(err)
            addLog(err)
        }
        console.log(data)
        start(data)
    })
}


function start(list) {

    console.log(list)
    console.log(list.length)

    for (var i = 0; i < list.length; i++) {
        var fileExtension = list[i].substring(list[i].lastIndexOf('.') + 1);
        console.log(fileExtension)
        if (fileExtension != 'png' && fileExtension != 'jpg') {
            list.splice(i, 1)
        }
    }

    console.log(list)

    var lengthList, temLength = 0
    lengthList = list.length

    addLog('读取列表完成，共有' + lengthList + '个图片')

    list.forEach(function (file) {
        var inFilePath = inDir + '/' + file;
        var outFilePath = outDir + '/' + file;
        fs.readFile(inFilePath, function (err, sourceData) {
            if (err) {
                errHandle(err)
                return
            };
            tinify.fromBuffer(sourceData).toBuffer(function (err, resultData) {
                if (err) throw err;
                fs.writeFileSync(outFilePath, resultData);
                console.log(lengthList, temLength)
                addLog('√' + file + ' 剩余' + (lengthList - temLength - 1) + '个')
                temLength++
                if (temLength === lengthList) {
                    addLog('Done!')
                }
            });
        });
    });
}

// 压缩
var compressionFile = function (nameList) {
    fs.readFile("map_24.png", function (err, sourceData) {
        if (err) {
            errHandle(err)
            return
        };
        tinify.fromBuffer(sourceData).toBuffer(function (err, resultData) {
            if (err) throw err;
            fs.writeFileSync('s.png', resultData);
            addLog('压缩完成')
        });
    });
}

var errHandle = function (err) {
    if (err instanceof tinify.AccountError) {
        addLog("账户错误，Key 该换了: " + err.message);
        // Verify your API key and account limit.
    } else if (err instanceof tinify.ClientError) {
        addLog('客户端错误')
        // Check your source image and request options.
    } else if (err instanceof tinify.ServerError) {
        addLog('服务端错误')
        // Temporary issue with the Tinify API.
    } else if (err instanceof tinify.ConnectionError) {
        addLog('网络错误')
        // A network connection error occurred.
    } else {
        addLog('未知错误')
        // Something else went wrong, unrelated to the Tinify API.
    }
}

document.getElementById('inDir').addEventListener('click', () => {
    dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory']
    }, (res) => {
        if (res) {
            inDir = res[0]
            addLog('当前输入目录:' + res[0])
        }
    });
})

document.getElementById('outDir').addEventListener('click', () => {
    dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory']
    }, (res) => {
        if (res) {
            outDir = res[0]
            addLog('当前输出目录:' + res[0])
        }
    });
})

document.getElementById('start').addEventListener('click', () => {
    if (!inDir) {
        addLog('请选择输入目录')
        return
    }
    if (!outDir) {
        addLog('请选择输出目录')
        return
    }
    initList()
})

document.getElementById('link').addEventListener('click', () => {
    shell.openExternal('https://github.com/Lucassssss')
})

document.getElementById('cancel').addEventListener('click', () => {
    document.getElementById('modal').style.display = "none"
})

document.getElementById('keyManage').addEventListener('click', () => {
    document.getElementById('modal').style.display = "block"
    let list = localStorage.getItem('keyList')
    console.log(document.getElementById('keyListInput').children)
    if(list) {
        let listArray = list.split(',')
        for(let i = 0; i< listArray.length; i++) {
            document.getElementById('keyListInput').children[i].value = listArray[i]
        }
    }
})

document.getElementById('confirm').addEventListener('click', () => {
    let inputList = document.getElementById('keyListInput').children
    for(let i=0; i<inputList.length;i++) {
        console.log(inputList[i].value)
        if(inputList[i].value) {
            keyListArray.push(inputList[i].value)
        }
    }
    localStorage.setItem('keyList', keyListArray.join(','))
    keyListArray = []
    document.getElementById('modal').style.display = 'none'
    checkKey(0)
})

document.getElementById('getKey').addEventListener('click', () => {
    shell.openExternal('https://tinypng.com/developers')
})

function addLog(str) {
    let d = new Date()
    document.getElementById('log').textContent += '\n' + '# ' +str
    document.getElementById('log').scrollTo(0,document.getElementById('log').scrollHeight);
}

Array.prototype.removeByIndex = function (dx)　 {　　
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    this.splice(dx, 1);　
}

