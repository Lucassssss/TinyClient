# TinyClient

TinyClient 是一个超强压缩图片的小工具，压缩率可以达到 50% 以上，压缩质量接近无损。是一个基于 Electron 和 Tinypng 的图片压缩客户端工具。

![](https://raw.githubusercontent.com/Lucassssss/TinyClient/master/screenshot.png)

## 开发/预览

需要安装 [Git](https://git-scm.com) 和 [Node.js](https://nodejs.org/en/download/) (包含 [npm](http://npmjs.com)) ，然后运行下面的命令行:

```bash
# Clone this repository
git clone https://github.com/Lucassssss/TinyClient.git
# Go into the repository
cd TinyClient
# Install dependencies
npm install
# Run the app
npm start
```
如果一切顺利的话就可以看到上面截图显示的样子，然后根据你自己的需求进行二次开发。

## 构建/打包
如果你是懒人，你可以直接下载[这里](https://github.com/Lucassssss/TinyClient/releases)的 releases 包，我已经构建好了 Windows 版本的包，Mac，Linux，大概类似这样：  

如果你使用 [electron-packager](https://github.com/electron-userland/electron-packager)
``` 
npm install electron-packager --save-dev
```
然后开始打包:

```
electron-packager <location of project> <name of project> <platform> <architecture> <electron version> <optional options>
```
或者使用 [NSIS](https://blog.csdn.net/yu17310133443/article/details/79496499) 打包安装文件，项目目录中我已经构建好了 ```nsi```文件，运行并编译即可。

## License
[GPL License](https://www.gnu.org/licenses/gpl.html)