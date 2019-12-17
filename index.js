const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git/promise');
const dayjs = require('dayjs');
const uuidv4 = require('uuid/v4');
const ProgressBar = require('progress');

function getDefaultOptions() {
  return {
    days: 400,
    fileName: 'main.cpp',
    code: `#include <iostream>\nint main()\n{\n  std::cout << "Hello World!" << std::endl;\n  return 0;\n}\n`,
    daysOff: [],
    offFraction: 0.0,
    maxCommitsPerPage: 10,
  };
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function choice(array) {
  return array[randomInt(0, array.length - 1)];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function loadCommitMessages(path) {
  const { names, messages } = JSON.parse(fs.readFileSync(path));
  const re = new RegExp(/{name}/g);

  return messages.map(m => m.replace(re, choice(names)));
}

function setRandomTime(date) {
  return date
    .set('hour', randomInt(0, 24))
    .set('minute', randomInt(0, 60))
    .set('second', randomInt(0, 60))
    .set('millisecond', randomInt(0, 1000));
}

function makeProgressBar(total) {
  return new ProgressBar('  processing [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total,
  });
}

module.exports = class RockStar {
  constructor({ ...options }) {
    options = Object.assign(getDefaultOptions(), options);

    this.days = options.days;
    this.filePath = path.join(process.cwd(), options.fileName);
    this.code = options.code;
    this.daysOff = options.daysOff.map(capitalize);
    this.offFraction = options.offFraction;
    this.maxCommitsPerPage = options.maxCommitsPerPage;
    this.messages = loadCommitMessages(path.join(__dirname, 'commit-messages.json'));
  }

  getDates() {
    const today = dayjs();
    const dates = [];
  
    for (let i = 0; i < this.days; i++) {
      const date = today.subtract(i, 'day');
  
      if (this.daysOff.includes(date.format('dddd'))) {
        continue;
      }
  
      if (randomInt(0, 100) < this.offFranction * 100) {
        continue;
      }
  
      let commitCount = randomInt(1, config.maxCommitsPerPage);
  
      while (commitCount--) {
        dates.push(setRandomTime(date));
      }
    }
  
    return dates.sort((a, b) => a.unix() - b.unix());
  }

  async edit(date) {
    fs.writeFileSync(this.filePath, uuidv4());

    const dateInISO = date.toISOString();
    process.env['GIT_COMMITTER_DATE'] = dateInISO;

    await this.git.add(this.filePath);
    await this.git.commit(choice(this.messages), undefined, { '--date': dateInISO });
  }

  async finalCommit() {
    fs.writeFileSync(this.filePath, this.code);

    process.env['GIT_COMMITTER_DATE'] = '';

    await this.git.add(this.filePath);
    await this.git.commit('Final commit :sunglasses:');
  }

  async makeMeARockstar() {
    this.git = await simpleGit(process.cwd());
    this.git.init();

    const dates = this.getDates();

    const bar = makeProgressBar(dates.length);

    for (const date of dates) {
      await this.edit(date);
      bar.tick();
    }

    await this.finalCommit();
    console.log('\nYou are now a Rockstar Programmer!');
  }
}
