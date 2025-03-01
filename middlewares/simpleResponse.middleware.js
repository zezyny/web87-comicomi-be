export const simpleResponse = (req, res, next) => {
    res.ok = (data, message = "OK") => res.status(200).json({ message, data });
    res.badRequest = (error, message = "Invalid data") => res.status(400).json({ message, error });
    res.unauthorized = (error, message = "Unauthorized") => res.status(401).json({ message, error });
    res.forbidden = (error, message = "Forbidden") => res.status(401).json({ message, error });
    res.notFound = (error, message = "Not found") => res.status(404).json({ message, error });
    res.serverError = (error, message = "Server error") => res.status(500).json({ message, error });
    next();
}