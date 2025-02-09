const respond = (request, response, status, object, acceptType) => {
    let content;
    let headers;

    if (acceptType.includes('application/xml')) {
        content = `<?xml version="1.0" encoding="UTF-8"?>
        <response>
          <message>${object.message}</message>
          ${object.id ? `<id>${object.id}</id>` : ''}
        </response>`.trim();

        headers = { 'Content-Type': 'application/xml' };
    } else {
        content = JSON.stringify(object);

        headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(content, 'utf8'),
        };
    }

    response.writeHead(status, headers);

    if (request.method !== 'HEAD') {
        response.write(content);
    }

    response.end();
};

// determines the response type
const getResponseType = (request) => {
    return request.headers.accept && request.headers.accept.includes('application/xml')
        ? 'application/xml'
        : 'application/json';
};

// endpoints
const getSuccess = (request, response) => {
    const responseObj = { message: 'Request succeeded.' };
    return respond(request, response, 200, responseObj, getResponseType(request));
};

const getBadRequest = (request, response) => {
    const urlParams = new URL(request.url, `http://${request.headers.host}`).searchParams;
    const isValid = urlParams.get('valid') === 'true';

    const responseObj = isValid
        ? { message: 'Request succeeded.' }
        : { message: 'Missing valid query parameter set to true.', id: 'badRequest' };

    const status = isValid ? 200 : 400;
    return respond(request, response, status, responseObj, getResponseType(request));
};

const getUnauthorized = (request, response) => {
    const urlParams = new URL(request.url, `http://${request.headers.host}`).searchParams;
    const isLoggedIn = urlParams.get('loggedIn') === 'yes';

    const responseObj = isLoggedIn
        ? { message: 'Request succeeded.' }
        : { message: 'Missing loggedIn query parameter set to yes.', id: 'unauthorized' };

    const status = isLoggedIn ? 200 : 401;
    return respond(request, response, status, responseObj, getResponseType(request));
};

const getForbidden = (request, response) => {
    const responseObj = { message: 'You do not have access to this content.', id: 'forbidden' };
    return respond(request, response, 403, responseObj, getResponseType(request));
};

const getInternal = (request, response) => {
    const responseObj = { message: 'Internal Server Error. Something went wrong.', id: 'internalError' };
    return respond(request, response, 500, responseObj, getResponseType(request));
};

const getNotImplemented = (request, response) => {
    const responseObj = { message: 'This functionality is not yet implemented.', id: 'notImplemented' };
    return respond(request, response, 501, responseObj, getResponseType(request));
};

const notFound = (request, response) => {
    const responseObj = { message: 'The page you are looking for was not found.', id: 'notFound' };
    return respond(request, response, 404, responseObj, getResponseType(request));
};

module.exports = {
    getSuccess,
    getBadRequest,
    getUnauthorized,
    getForbidden,
    getInternal,
    getNotImplemented,
    notFound,
};
