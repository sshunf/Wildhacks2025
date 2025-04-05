export const exampleMiddleware = (req, res, next) => {
    // Example middleware function
    console.log('Request received:', req.method, req.url);
    next();
};

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};