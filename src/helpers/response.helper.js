export default {

    api: {

        // Successful responses.
        success(res, msg = null, data = undefined) {
            res.statusCode = 200;
            return res.json({ msg, data });
        },

        // Client error responses.
        badRequest(res, msg = "Server can't process your request.") {
            res.statusCode = 400;
            return res.json({ msg });
        },

        unauthorized(res, logoutForce = true, msg = 'Unauthorized access.') {
            res.statusCode = 401;
            if (logoutForce) res.clearCookie('token');
            return res.json({ msg });
        },

        forbidden(res, msg = "You do't have access rights to the resource.") {
            res.statusCode = 403;
            return res.json({ msg });
        },

        notFound(res, msg = 'The requested resource was not found.') {
            res.statusCode = 404;
            return res.json({ msg });
        },

        methodNotAllowed(res, msg = 'Operation not allowed.') {
            res.statusCode = 505;
            return res.json({ msg });
        },

        // Server error responses.
        internalServerError(res, msg = 'Invalid process.') {
            res.statusCode = 500;
            return res.json({ msg });
        },
    },

    web: {
        //
    },

};
