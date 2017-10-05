const express = require('express');
const fs = require('fs');
const hbs = require('hbs');

const port = process.env.PORT || 3000;

var app = express();

var logContent;

hbs.registerPartials(__dirname + '/views/partials')

app.set('view engine', 'hbs');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

app.use((req, res, next) => {

  if (req.url === '/ping') {
    var now = new Date().toString();
    var log = `Ping! ${now}`;
    console.log(log);
    fs.appendFile('pingReq.log', log + '<br />', (err) => {
      if (err) {
        console.log('Unable to append to pingReq.log')
      }
    });
    next();
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  // console.log(req.url);
  fs.readFile('./pingReq.log', function read(err, data) {
    if (err) {
        throw err;
    }
    logContent = data;
  });

  res.render('home.hbs', {
    pageTitle: 'RPi Watchdog Ping Log',
    pageContent: logContent,
  });
});

app.get('/ping', (req, res) => {
  // console.log(req.url);
  res.send({
    Status: 'Pong!'
  })
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
