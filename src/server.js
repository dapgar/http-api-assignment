const http = require('http'); // HTTP module
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// URL routing
const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/success': jsonHandler.getSuccess,
    '/badRequest': jsonHandler.getBadRequest,
    '/unauthorized': jsonHandler.getUnauthorized,
    '/forbidden': jsonHandler.getForbidden,
    '/internal': jsonHandler.getInternal,
    '/notImplemented': jsonHandler.getNotImplemented,
    notFound: jsonHandler.notFound,
};

// handle requests
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if (urlStruct[parsedUrl.pathname]) {
        return urlStruct[parsedUrl.pathname](request, response);
    }

    return urlStruct.notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});
