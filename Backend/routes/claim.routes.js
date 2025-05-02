const express = require('express');

const {create, getClaimsByPostId, updateClaimStatus} = require('../controllers/claim.controller');

const { authentication } = require('../middleware/authentication');

const claim_router = express.Router();

claim_router
    .post("/", authentication, create)
    .get("/:post_id", authentication, getClaimsByPostId)
    .patch("/:claim_id", authentication, updateClaimStatus)

module.exports = { claim_router };