const { createSpinner } = require('nanospinner');
const { spawn } = require('node:child_process');
const { writeFile: wf } = require('node:fs/promises');

function execute(command, args, texts, cwd = process.cwd()) {
  return new Promise((resolve) => {
    const spinner = createSpinner(texts.start).start();

    const proc = spawn(command, args, {
      cwd,
    });

    proc.on('exit', (code) => {
      if (code !== 0) {
        spinner.error(
          `Command \`${command} ${args.join(' ')}\` failed to execute`
        );
        process.exit(1);
      }
      spinner.success({ text: texts.end });
      resolve();
    });
  });
}

function writeFile(source, content, texts) {
  return new Promise((resolve) => {
    const spinner = createSpinner(texts.start).start();

    wf(source, content)
      .then(() => {
        spinner.success({ text: texts.end });
        resolve();
      })
      .catch((error) => {
        spinner.error('An error occured while writing file');
        console.error(error);
        process.exit(1);
      });
  });
}

module.exports = {
  execute,
  writeFile,
};
