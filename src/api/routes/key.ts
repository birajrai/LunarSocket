import { Router } from 'express';
import getConfig from '../../utils/config';
import auth from '../middleware/auth';

const keyRouter = Router();

keyRouter.get('/', auth, async (request, response) => {
  response.status(200).send({
    wsPath: (await getConfig()).server.websocketPath,
  });
});

export default keyRouter;
