# dat-react-shopping-list

![Logo](https://dat-shopping-list.glitch.me/img/dat-shopping-list-96.png)

[https://dat-react-shopping-list.glitch.me/](https://dat-react-shopping-list.glitch.me/)

Note: If you want to try dat-react-shopping-list locally, please checkout this `local-dev` branch. `master` branch is used for glitch.

`dat-react-shopping-list` is served on glitch. Currently glitch only allow importing code from `master` branch, and only export one port to the outside world. At the same time this project is developed by create-react-app, which use the 3000 port inside its box on dev mode.(`react-app-rewired start`) which means websocket need to be served on the other server. This is the [websocket server code](https://github.com/ZhouHansen/dat-react-shopping-list-websocket)

The only difference between `local-dev` and `master` is that on `local-dev` branch server side code is located at `src/websocket.js`, and the client will visit the local websocket.

# Overview

Adapted from [jimpick/dat-shopping-list](https://github.com/jimpick/dat-shopping-list)

Dat Shopping List is a "Progressive Web App" built to demonstrate how to use the
new "multiwriter" capabalities that are being added to the [Dat Project](https://datproject.org/).

The demo is a simple "to do list" app, in the spirit of the [TodoMVC](http://todomvc.com/) project.

You can run it on any modern web browser. Also, you can run it on your mobile phone (iOS and Android), and it should work offline as well as online.

Check out the blog post:

- [Demo: A Collaborative Shopping List Built On Dat](https://blog.datproject.org/2018/05/14/dat-shopping-list/)

![Quick Usage Gif](https://dat-shopping-list-video-jimpick.hashbase.io/dat-shopping-list-basic.gif)

## Video Walkthrough

Here is a short (2.5 minute) walkthrough of the demo.

- [Video Walkthrough (MP4)](https://dat-shopping-list-video-jimpick.hashbase.io/dat-shopping-list-1.mp4)

# Quick Deploy / Free Hosting Options

The demo is very easy to deploy, as it is self-contained, and requires no storage.

There are many ways for you to run your own instance. You may want to run your own instance for privacy reasons, reliability reasons, or so you can customize it.

# Try it out

```
$ cd dat-react-shopping-list
$ git checkout local-dev
$ npm install
$ npm start
```

# License

MIT
