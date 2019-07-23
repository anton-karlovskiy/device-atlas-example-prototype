var ApiValues = require('./main.js').ApiValues,
    http = require('http'),
    jade = require('jade'),
    fs = require('fs');

function renderJade(req, template, res) {

    try {
        var apiValues = new ApiValues(req);
        apiValues.cache = false;
        var html = jade.renderFile('templates/' + template + '.jade', apiValues);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);
    } catch (exception) {
        console.log(exception);
        var html = jade.renderFile('templates/error.jade', {errorMessage: exception.message, cache:false});
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write(html);
    }

    res.end();
};

function serveFile(req, res, contentType) {
    fs.readFile(__dirname + req.url, function (err, data) {
        if (err) {
            res.writeHead(404);
            console.log(err);
        }
        res.writeHead(200, {'Content-Type': contentType});
        res.write(data);
        res.end();
    });
}
function handleRequest(req, res) {

    if (req.url.indexOf('.js') != -1) {
        serveFile(req, res, 'text/javascript');
    } else if (req.url.indexOf('.css') != -1) {
        serveFile(req, res, 'text/css');
    } else if (req.url.indexOf('.ico') != -1) {
        res.writeHead(404);
        res.end();
    } else if (req.url === '/') {
        renderJade(req, 'index', res);
    } else {
        renderJade(req, req.url, res);
    }
}

http.createServer(handleRequest).listen(8080);
