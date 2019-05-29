const express = require('express');
const hbs = require('hbs');
var WebTorrent = require('webtorrent-hybrid');
var bodyParser = require("body-parser");
const fs = require('fs');
const {google} = require('googleapis');
var mime = require('mime-types');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('public/scratch');
require('dotenv').config();

opts = {
  connections: 1000,     // Max amount of peers to be connected to.
  uploads: 1,          // Number of upload slots.
  tmp: __dirname + '/downloads',          // Root folder for the files storage.
                        // Defaults to '/tmp' or temp folder specific to your OS.
                        // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
  path: __dirname + '/downloads', // Where to save the files. Overrides `tmp`.
  verify: true,         // Verify previously stored data before starting
                        // Defaults to true
  dht: true,            // Whether or not to use DHT to initialize the swarm.
                        // Defaults to true
  tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                        // Defaults to true
  trackers: [
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.ccc.de:80',
      "udp://public.popcorn-tracker.org:6969/announce","http://104.28.1.30:8080/announce","http://104.28.16.69/announce","http://107.150.14.110:6969/announce","http://109.121.134.121:1337/announce","http://114.55.113.60:6969/announce","http://125.227.35.196:6969/announce","http://128.199.70.66:5944/announce","http://157.7.202.64:8080/announce","http://158.69.146.212:7777/announce","http://173.254.204.71:1096/announce","http://178.175.143.27/announce","http://178.33.73.26:2710/announce","http://182.176.139.129:6969/announce","http://185.5.97.139:8089/announce","http://188.165.253.109:1337/announce","http://194.106.216.222/announce","http://195.123.209.37:1337/announce","http://210.244.71.25:6969/announce","http://210.244.71.26:6969/announce","http://213.159.215.198:6970/announce","http://213.163.67.56:1337/announce","http://37.19.5.139:6969/announce","http://37.19.5.155:6881/announce","http://46.4.109.148:6969/announce","http://5.79.249.77:6969/announce","http://5.79.83.193:2710/announce","http://51.254.244.161:6969/announce","http://59.36.96.77:6969/announce","http://74.82.52.209:6969/announce","http://80.246.243.18:6969/announce","http://81.200.2.231/announce","http://85.17.19.180/announce","http://87.248.186.252:8080/announce","http://87.253.152.137/announce","http://91.216.110.47/announce","http://91.217.91.21:3218/announce","http://91.218.230.81:6969/announce","http://93.92.64.5/announce","http://atrack.pow7.com/announce","http://bt.henbt.com:2710/announce","http://bt.pusacg.org:8080/announce","http://bt2.careland.com.cn:6969/announce","http://explodie.org:6969/announce","http://mgtracker.org:2710/announce","http://mgtracker.org:6969/announce","http://open.acgtracker.com:1096/announce","http://open.lolicon.eu:7777/announce","http://open.touki.ru/announce.php","http://p4p.arenabg.ch:1337/announce","http://p4p.arenabg.com:1337/announce","http://pow7.com:80/announce","http://retracker.gorcomnet.ru/announce","http://retracker.krs-ix.ru/announce","http://retracker.krs-ix.ru:80/announce","http://secure.pow7.com/announce","http://t1.pow7.com/announce","http://t2.pow7.com/announce","http://thetracker.org:80/announce","http://torrent.gresille.org/announce","http://torrentsmd.com:8080/announce","http://tracker.aletorrenty.pl:2710/announce","http://tracker.baravik.org:6970/announce","http://tracker.bittor.pw:1337/announce","http://tracker.bittorrent.am/announce","http://tracker.calculate.ru:6969/announce","http://tracker.dler.org:6969/announce","http://tracker.dutchtracking.com/announce","http://tracker.dutchtracking.com:80/announce","http://tracker.dutchtracking.nl/announce","http://tracker.dutchtracking.nl:80/announce","http://tracker.edoardocolombo.eu:6969/announce","http://tracker.ex.ua/announce","http://tracker.ex.ua:80/announce","http://tracker.filetracker.pl:8089/announce","http://tracker.flashtorrents.org:6969/announce","http://tracker.grepler.com:6969/announce","http://tracker.internetwarriors.net:1337/announce","http://tracker.kicks-ass.net/announce","http://tracker.kicks-ass.net:80/announce","http://tracker.kuroy.me:5944/announce","http://tracker.mg64.net:6881/announce","http://tracker.opentrackr.org:1337/announce","http://tracker.skyts.net:6969/announce","http://tracker.tfile.me/announce","http://tracker.tiny-vps.com:6969/announce","http://tracker.tvunderground.org.ru:3218/announce","http://tracker.yoshi210.com:6969/announce","http://tracker1.wasabii.com.tw:6969/announce","http://tracker2.itzmx.com:6961/announce","http://tracker2.wasabii.com.tw:6969/announce","http://www.wareztorrent.com/announce","http://www.wareztorrent.com:80/announce","https://104.28.17.69/announce","https://www.wareztorrent.com/announce","udp://107.150.14.110:6969/announce","udp://109.121.134.121:1337/announce","udp://114.55.113.60:6969/announce","udp://128.199.70.66:5944/announce","udp://151.80.120.114:2710/announce","udp://168.235.67.63:6969/announce","udp://178.33.73.26:2710/announce","udp://182.176.139.129:6969/announce","udp://185.5.97.139:8089/announce","udp://185.86.149.205:1337/announce","udp://188.165.253.109:1337/announce","udp://191.101.229.236:1337/announce","udp://194.106.216.222:80/announce","udp://195.123.209.37:1337/announce","udp://195.123.209.40:80/announce","udp://208.67.16.113:8000/announce","udp://213.163.67.56:1337/announce","udp://37.19.5.155:2710/announce","udp://46.4.109.148:6969/announce","udp://5.79.249.77:6969/announce","udp://5.79.83.193:6969/announce","udp://51.254.244.161:6969/announce","udp://62.138.0.158:6969/announce","udp://62.212.85.66:2710/announce","udp://74.82.52.209:6969/announce","udp://85.17.19.180:80/announce","udp://89.234.156.205:80/announce","udp://9.rarbg.com:2710/announce","udp://9.rarbg.me:2780/announce","udp://9.rarbg.to:2730/announce","udp://91.218.230.81:6969/announce","udp://94.23.183.33:6969/announce","udp://bt.xxx-tracker.com:2710/announce","udp://eddie4.nl:6969/announce","udp://explodie.org:6969/announce","udp://mgtracker.org:2710/announce","udp://open.stealth.si:80/announce","udp://p4p.arenabg.com:1337/announce","udp://shadowshq.eddie4.nl:6969/announce","udp://shadowshq.yi.org:6969/announce","udp://torrent.gresille.org:80/announce","udp://tracker.aletorrenty.pl:2710/announce","udp://tracker.bittor.pw:1337/announce","udp://tracker.coppersurfer.tk:6969/announce","udp://tracker.eddie4.nl:6969/announce","udp://tracker.ex.ua:80/announce","udp://tracker.filetracker.pl:8089/announce","udp://tracker.flashtorrents.org:6969/announce","udp://tracker.grepler.com:6969/announce","udp://tracker.ilibr.org:80/announce","udp://tracker.internetwarriors.net:1337/announce","udp://tracker.kicks-ass.net:80/announce","udp://tracker.kuroy.me:5944/announce","udp://tracker.leechers-paradise.org:6969/announce","udp://tracker.mg64.net:2710/announce","udp://tracker.mg64.net:6969/announce","udp://tracker.opentrackr.org:1337/announce","udp://tracker.piratepublic.com:1337/announce","udp://tracker.sktorrent.net:6969/announce","udp://tracker.skyts.net:6969/announce","udp://tracker.tiny-vps.com:6969/announce","udp://tracker.yoshi210.com:6969/announce","udp://tracker2.indowebster.com:6969/announce","udp://tracker4.piratux.com:6969/announce","udp://zer0day.ch:1337/announce","udp://zer0day.to:1337/announce"
  ],
                        // Allows to declare additional custom trackers to use
                        // Defaults to empty
  
}
var client = new WebTorrent(opts);
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(fileUpload());

app.use((req, res, next) =>{
    var now = new Date().toString();
    console.log(`${now}: ${req.method} ${req.url}`);
    if (req.url.startsWith('/downloader?code=')){
      var text = req.url;
      var code = text.substring(
        text.lastIndexOf("?") + 6, 
        text.lastIndexOf("&")
    );
      localStorage.setItem('code', code);
    }
    next();
})
app.get('/', (req, res)=>{
   res.render('index.hbs', {client_id: process.env.CLIENT_ID});
})
app.get('/downloader', (req, res)=>{
    res.render('downloader.hbs');
 })
app.post('/downloader', (req, res)=>{
  var code = localStorage.getItem('code');
  console.log('code', code);
  var client_id = process.env.CLIENT_ID;
  var redirect_uri = "https://torrent-2-gdrive.herokuapp.com/downloader";
// var redirect_uri = "http://localhost:3000/downloader"
  const client_secret = process.env.CLIENT_SECRET;
  const SCOPE = ['https://www.googleapis.com/auth/drive'];

  authorize(uploadFile);

  function authorize(callback) {
    // const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uri);

    // Check if we have previously stored a token.
    if (localStorage.getItem('token') == null){
      return getAccessToken(oAuth2Client, callback);
    }else
      {
        oAuth2Client.setCredentials(JSON.parse(localStorage.getItem('token')));
        callback(oAuth2Client);
      }
  }

  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPE,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    
    if(code){
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        // fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        //   if (err) return console.error(err);
        //   console.log('Token stored to', TOKEN_PATH);
        // });
        localStorage.setItem('token', JSON.stringify(token));
        callback(oAuth2Client);
      });
    };
  }

  function uploadFile(auth) {

    var magnetURI = req.body.magnet;

    console.log(magnetURI);
    client.add(magnetURI, opts, function (torrent) {
        // Got torrent metadata!
        console.log('Client is downloading:', torrent.infoHash)
        // console.log('File is: ',torrent.files);
        // Print out progress every 5 seconds
        // console.log('File path is', file.path)
        var interval = setInterval(function () {
            torrent.resume();
            console.log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%');
            console.log(' Time Remaining:' + torrent.timeRemaining/60000 + 'min');
            console.log('Downloaded: ' + torrent.downloaded/(1024*1024) + ' MB');
            console.log('Speed: ' + (torrent.downloadSpeed/(1024*1024)) + ' MB/sec');
        }, 5000);

        torrent.on('done', function () {
            clearInterval(interval);
            console.log('torrent download finished');
            const drive = google.drive({version: 'v3', auth});
            // for creating folders in google drive
            var fileMetadata = {
              'name': torrent.name,
              'mimeType': 'application/vnd.google-apps.folder'
            };
            drive.files.create({
              resource: fileMetadata,
              fields: 'id'
            }, function (err, file) {
              if (err) {
                // Handle error
                console.error(err);
              } else {
                  console.log('Folder Id: ', file.data.id);
                  var folderId = file.data.id;
                  // upload dwownloaded files
                  torrent.files.forEach(function (file) {
                    var fileMetadata = {
                      'name': file.name,
                      parents: [folderId]
                    };
                    var media = {
                      mimeType: mime.lookup(file.name),
                      body: fs.createReadStream(__dirname + '/downloads/' + file.path)
                    };
                    drive.files.create({
                      resource: fileMetadata,
                      media: media,
                      fields: 'id'
                    }, function (err, file) {
                      if (err) {
                        // Handle error
                        console.error(err);
                      } else {
                        console.log('File Id: ', file.data.id);
                      }
                    });
                  })
              }
            });
        });
    })
    
    
  }
      res.render('downloader.hbs', {download: 'Downloading, Check google drive after few minutes...', magnetURI: req.body.magnet});   
});

app.listen(port, (req, res)=>{
    console.log(`Server is running on port ${port}`)
});