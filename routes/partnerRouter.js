const express = require("express");
const partnerRouter = express.Router();
const Partner = require("../models/partner");

partnerRouter
    .route("/")
    .get((req, res, next) => {
        Partner.find()
            .then((partners) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(partners);
            })
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Partner.create(req.body)
            .then((partner) => {
                console.log("Partner Created", partner);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(partner);
            })
            .catch((err) => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /partners");
    })
    .delete((req, res, next) => {
        Partner.deleteMany()
            .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(response);
            })
            .catch((err) => next(err));
    });

partnerRouter
    .route("/:partnerId")
    .get((req, res, next) => {
        Partner.findById(req.params.partnerId)
            .then((partner) => {
                if (partner) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(partner);
                } else {
                    let err = new Error(
                        `Partner ${req.params.partnerId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        Partner.findById(req.params.partnerId)
            .then((partner) => {
                if (partner) {
                    partner.partnerId.push(req.body);
                    partner
                        .save()
                        .then((partner) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(partner);
                        })
                        .catch((err) => next(err));
                } else {
                    let err = new Error(
                        `Partner ${req.params.partnerId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })

    .put((req, res) => {
        res.write(`Updating the partner: ${req.params.partnerId}\n`);
        res.end(`Will update the partner: ${req.body.name}
        with description: ${req.body.description}`);
    })

    .delete((req, res, next) => {
        Partner.findByIdAndRemove(req.params.partnerId)
            .then((partner) => {
                if (partner) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(partner);
                } else {
                    let err = new Error(
                        `Partner ${req.params.partnerId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    });

module.exports = partnerRouter;
