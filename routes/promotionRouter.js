const express = require("express");
const promotionRouter = express.Router();
const Promotion = require("../models/promotion");
const authenticate = require("../authenticate");

promotionRouter
    .route("/")
    .get((req, res, next) => {
        Promotion.find()
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(promotions);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Promotion.create(req.body)
            .then((promotion) => {
                console.log("Promotion Created", promotion);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(promotion);
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /promotions");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotion.deleteMany()
            .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(response);
            })
            .catch((err) => next(err));
    });

promotionRouter
    .route("/:promotionId")
    .get((req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then((promotion) => {
                if (promotion) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(promotion);
                } else {
                    const err = new Error(
                        `Promotion ${req.params.promotionId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then((promotion) => {
                if (promotion) {
                    promotion.promotionId.push(req.body);
                    promotion
                        .save()
                        .then((promotion) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(promotion);
                        })
                        .catch((err) => next(err));
                } else {
                    const err = new Error(
                        `Promotion ${req.params.promotionId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res) => {
        res.write(`Updating the promotion: ${req.params.promotionId}\n`);
        res.end(`Will update the promotion: ${req.body.name}
        with description: ${req.body.description}`);
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotion.findByIdAndDelete(req.params.promotionId)
            .then((promotion) => {
                if (promotion) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(promotion);
                } else {
                    const err = new Error(
                        `Promotion ${req.params.promotionId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    });

module.exports = promotionRouter;
