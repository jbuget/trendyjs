import express from 'express';

const router = express.Router();

/* GET /users */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

export default router;
