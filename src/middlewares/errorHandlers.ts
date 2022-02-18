import { ErrorRequestHandler } from "express";

export const errorHandlers: ErrorRequestHandler = (err, req, res, next) => {
    switch (err.status) {
        case 400: return res.status(400).send(err)
        case 401: return res.status(401).send(err)
        case 403: return res.status(403).send(err)
        case 404: return res.status(404).send(err)
        default: return res.status(500).send('Server Error')
    }
}