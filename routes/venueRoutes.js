const express = require('express');
const venueController = require('../controllers/venueController');

const router = express.Router();

router
  .route('/')
  .get(venueController.getVenues)
  .post(venueController.createVenue);

router
  .route('/:id')
  .get(venueController.getVenue)
  .patch(venueController.updateVenue)
  .delete(venueController.deleteVenue);

module.exports = router;
