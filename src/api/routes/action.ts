import { Router } from 'express';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { getConfigSync } from '../../utils/config';
import { registerEvent } from '../../utils/events';
import auth from '../middleware/auth';

const config = getConfigSync();

const actionRouter = Router();

actionRouter.post('/update', auth, (request, response) => {
  registerEvent('update', Date.now().toString());

  const proc = spawn('npm', ['run', 'update'], {
    cwd: join(__dirname, '..', '..', '..'),
  });

  proc.on('exit', () => {
    response.sendStatus(200);
  });

  proc.on('error', (err) => {
    response.send(err).sendStatus(500);
  });
});

actionRouter.post('/restart', auth, (request, response) => {
  registerEvent('restart', Date.now().toString());

  const args = config.commands.restart.split(' ');
  const proc = spawn(args.shift(), args, {
    cwd: join(__dirname, '..', '..', '..', '..'),
  });

  proc.on('exit', () => {
    response.sendStatus(200);
  });

  proc.on('error', (err) => {
    response.send(err).sendStatus(500);
  });
});

actionRouter.post('/stop', auth, (request, response) => {
  registerEvent('stop', Date.now().toString());

  const args = config.commands.stop.split(' ');
  const proc = spawn(args.shift(), args, {
    cwd: join(__dirname, '..', '..', '..', '..'),
  });

  proc.on('exit', () => {
    response.sendStatus(200);
  });

  proc.on('error', (err) => {
    response.send(err).sendStatus(500);
  });
});

actionRouter.post('/kill', auth, (request, response) => {
  registerEvent('kill', Date.now().toString());

  response.sendStatus(200);
  process.exit(0);
});

export default actionRouter;
