const { execute, writeFile } = require('./utils');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const prompt = require('prompt');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

(async () => {
  console.log(
    "Welcome to the LunarSocket install process, if you are in setup mode\nyou'll be asked a few questions to setup LunarSocket.\n"
  );

  await execute('git', ['pull'], {
    start: 'Making sure you have the latest verison...',
    end: 'Local copy up to date',
  });

  await execute(npm, ['install'], {
    start: 'Installing required dependencies...',
    end: 'All dependencies installed',
  });

  await execute(npm, ['run', 'build'], {
    start: 'Building source code...',
    end: 'Source code built',
  });

  if (process.argv.includes('--update')) {
    console.log('\nLunarSocket has been updated!');
    process.exit(0);
  }

  const configExampleSource = join(process.cwd(), 'config.example.json');
  const config = JSON.parse(readFileSync(configExampleSource, 'utf8'));

  prompt.start();

  const results = await prompt.get({
    message: 'test',
    properties: {
      serverPort: {
        description: 'Port to listen to',
        default: 80,
        type: 'integer',
      },
      secure: {
        description: 'Secure mode? (wss)',
        default: false,
        type: 'boolean',
      },
      keyPath: {
        description: 'Private key path',
        type: 'string',
        required: true,
        ask() {
          return prompt.history('secure').value;
        },
      },
      certPath: {
        description: 'Public cert path',
        type: 'string',
        required: true,
        ask() {
          return prompt.history('secure').value;
        },
      },
      api: {
        description: 'Enable API?',
        default: false,
        type: 'boolean',
      },
      apiAuth: {
        description: 'API Password',
        required: true,
        type: 'string',
        ask() {
          return prompt.history('api').value;
        },
      },
      whitelist: {
        description: 'Do you want to enable the whitelist?',
        default: false,
        type: 'boolean',
      },
      welcomeMessage: {
        description: 'Set a custom welcome message',
        default: 'Welcome!',
        type: 'string',
      },
      databaseType: {
        description:
          'What database do you want to use? (instanceStorage, fileStorage, mongo)',
        pattern: /instanceStorage|fileStorage|mongo/,
        default: 'instanceStorage',
        type: 'string',
      },
      mongo: {
        description: 'Mongo uri',
        required: true,
        type: 'string',
        ask() {
          return prompt.history('databaseType').value === 'mongo';
        },
      },
      filePath: {
        description: 'Path to the file used by fileStorage database',
        required: true,
        type: 'string',
        ask() {
          return prompt.history('databaseType').value === 'fileStorage';
        },
      },
    },
  });

  config.server.port = results.serverPort;
  config.server.secure = results.secure;
  config.server.certificates = {
    key: results.keyPath,
    cert: results.certPath,
  };
  config.api.enabled = results.api;
  config.api.authorization = results.apiAuth;
  config.whitelist.enabled = results.whitelist;
  config.welcomeMessage = results.welcomeMessage;
  config.database.type = results.databaseType;
  config.database.config = {
    mongo: results.mongo,
    filePath: results.filePath,
  };

  await writeFile(
    join(process.cwd(), 'config.json'),
    JSON.stringify(config, null, 2),
    {
      start: 'Writing config file...',
      end: 'Config file written',
    }
  );

  const dashboardWd = join(__dirname, '..', 'dashboard');

  if (results.api) {
    await execute(
      npm,
      ['install'],
      {
        start: 'Installing required dashboard dependencies...',
        end: "All dashboard's dependencies installed",
      },
      dashboardWd
    );

    await execute(
      npm,
      ['run', 'build'],
      {
        start: 'Building dashboard source code...',
        end: "Dashboard's source code built",
      },
      dashboardWd
    );
  }

  console.log(
    'LunarSocket installation process finished! For advanced configuration make sure to edit the config.json file'
  );
})();
