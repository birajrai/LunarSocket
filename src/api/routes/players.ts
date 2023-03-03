import { Router } from 'express';
import { connectedPlayers } from '../..';
import ForceCrashPacket from '../../packets/ForceCrashPacket';
import auth from '../middleware/auth';

const playersRouter = Router();

playersRouter.get('/', auth, (request, response) => {
  const players = connectedPlayers.map((p) => ({
    uuid: p.uuid,
    username: p.username,
    role: p.role.name,
    server: p.server,
    version: p.version,
  }));

  response.status(200).send(players);
});

playersRouter.post('/kick', auth, (req, res) => {
  const uuid = req.body.uuid;
  if (typeof uuid !== 'string') return res.sendStatus(400);
  const player = connectedPlayers.find((p) => p.uuid === uuid);
  if (!player) return res.sendStatus(404);
  player.removePlayer();
  return res.sendStatus(200);
});

playersRouter.post('/crash', auth, (req, res) => {
  const uuid = req.body.uuid;
  if (typeof uuid !== 'string') return res.sendStatus(400);
  const player = connectedPlayers.find((p) => p.uuid === uuid);
  if (!player) return res.sendStatus(404);
  const packet = new ForceCrashPacket();
  packet.write({});
  player.writeToClient(packet);
  return res.sendStatus(200);
});

export default playersRouter;
