var express = require('express');

var app = express();
var PORT = 8020;

// Serve static file sse-example.html
app.get('/', function (req, res, next) {
  var fileName = 'sse-example.html';
  res.sendFile(fileName, { root: __dirname }, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log('Sent: ', fileName);
    }
  });
});

// Server-sent events api
app.get('/sseapi', function (req, res, next) {

  // 设置 HTTP Status Code 与 HTTP Headers
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  // 设定浏览器在连接断开后延迟多长时间重新建立连接
  // 通过 retry 字段控制，其单位为毫秒
  res.write('retry: 10000\n');

  // 通过 data 字段发送所要传输的数据，冒号后面的空格字符被忽略，
  // 必须以两个换行符结尾才会发送一个 Event
  res.write('data: Test default event name\n\n');

  var score = 0;

  // 如果不指定 event，其默认为 "message"，即客户端需要监听的事件名称
  res.write('event: init\n');
  res.write('data: {"username": "Alex Chao", "score": ' + score + ' }\n\n');
  res.flushHeaders();

  var timerId = setInterval(function () {
    score++;

    res.write('event: update\n');
    res.write('data: { "score": ' + score + ' }\n\n');
    res.flushHeaders();
  }, 3000);

  // 连接关闭后清除定时器
  req.connection.on('close', function () {
    console.log('Connection was closed.');
    clearInterval(timerId);
  });
});

app.listen(PORT, function () {
  console.log('Server listening on: http://127.0.0.1:%s', PORT);
});

