# ![highcharts](https://www.dropbox.com/s/3se8pnb23b4csay/highcharts.png?raw=1)

The file `lib/highcharts-convert.js` is a [PhantomJS](http://phantomjs.org/) script to convert SVG or Highcharts JSON options objects to chart images. It is ideal for batch processing Highcharts configurations for attaching to emails or reports. An online demo with a GUI can be viewed at [export.highcharts.com/demo](http://export.highcharts.com/demo).

This fork is set up to allow the script to be run like any other node process (e.g. with nodemon for development and pm2 or the like for production).

> **Note**  The Highcharts files are subjected to the Highcharts License.

## Installation
This version is meant to be installed locally. 

```sh
git clone git clone https://github.com/zejacobi/highcharts-export-server.git
cd node_modules/highcharts-phantomjs
cd highcharts-export-server
npm install --production --no-optional
nodemon
```

> For this option to work, you need to have `phantomjs` binary in your PATH (see http://phantomjs.org/download.html).

If you want a more durable install, you can set it up with pm2. Instead of running with nodemon, you'll want to use:
```sh
pm2 start server.js --name HighchartsServer --watch -- -h 127.0.0.1 -p 3030
sudo pm2 save
sudo pm2 startup ubuntu
```

### API
After starting the converter server, it will listen for `POST` request. You can use the same parameters as for command line usage, but wrap them in a JSON structure.

Here is an example of a valid request, given a JSON body in some file:

```javascript
// example-request.json
{
    "infile": "{xAxis: {categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']},series: [{data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]}]};",
    "constr": "Chart"
}
```

This version also differs slightly from the master, in that I've hacked in some timezone code. To plot a timeseries plot with a utcOffset (in minutes), you'd use:

```javascript
// example-request.json
{
    "infile": "{series: [{data: [[1495038188226, 12], [14950382156837, 44]]}],globalOptions: {timezoneOffset: -300}};",
    "constr": "Chart"
}
```

In both cases, to actually send the command, use:

```sh
nodemon
info: [highcharts-convert]    Started converter on 127.0.0.1:3030 (PID: 1350)

# On another terminal
curl -XPOST http://localhost:3003 -H 'Content-Type: application/json' -d @example-request.json
```

One further change is how height and width are handled. Here you can use them like this:
 
 
```javascript
// example-request.json
{
    "infile": "{xAxis: {categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']},series: [{data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]}],width: 480, height: 290};",
    "constr": "Chart"
}
```