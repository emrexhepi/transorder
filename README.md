<h3 align="center">Transcorder</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Few lines describing your project.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Gettings Started](#getting_started)
- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Usage](#usage)
- [Debugging](#debugging)


## 🧐 About <a name = "about"></a>

Automated FFMPEG Recorder with Transcoding capabilities and custom options
It records and cuts based schedule presets.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [usage](#usage) for notes on how to use project for development and build.

### Prerequisites  <a name = "prerequisites"></a>

Git, NodeJS and NPM required. Please install from official NodeJS website.


### Installing

Clone Repository:
```
git clone https://github.com/emrexhepi/transcorder/
cd transcoder
```

Then install:
```
npm install
```

You are ready to run.



## 🎈 Usage <a name="usage"></a>

Start Development:
```
npm start
```

Build Transcorder:
```
npm build
```

## Debugging <a name="debugging"></a>

If you are using Visual Studio Code just press F5, there is lunch.json already in place.

## pm2 commands
`pm2 start dist/transcorder.js --watch`

