import { Request, Router } from 'express';
import findPlayer from '../../utils/findPlayer';
import auth from '../middleware/auth';

const displayColorRouter = Router();

displayColorRouter.patch(
  '/',
  auth,
  async (request: Request<{}, {}, RolesRequestBody>, response) => {
    if (
      typeof request.body.player !== 'string' ||
      typeof request.body.displayColor !== 'number' ||
      typeof request.body.displayPlusColor !== 'number'
    )
      return response.sendStatus(400);

    const player = findPlayer(request.body.player);
    if (!player)
      return response
        .status(404)
        .send('Player not found, make sure the player is connected');

    const permissions = player.role.data.permissions;
    if (
      !(
        permissions.includes('*') ||
        (permissions.includes('customization.displayColor') &&
          permissions.includes('customization.displayPlusColor'))
      )
    )
      return response
        .status(401)
        .send("Player doesn't have the right to use custom colors");

    player.customization.displayColor = request.body.displayColor;
    player.customization.displayPlusColor = request.body.displayPlusColor;
    await player.updateDatabase();

    player.sendNotification(
      'Customization',
      'Custom colors updated! Reconnecting...'
    );
    player.removePlayer();

    response.sendStatus(200);
  }
);

export default displayColorRouter;

interface RolesRequestBody {
  player: string;
  displayColor: number;
  displayPlusColor: number;
}
