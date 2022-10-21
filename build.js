require('dotenv').config();
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const dayjs = require('dayjs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
const fs = require('fs');
const path = require('path');

const BASE_CONFIG = {
  department: process.env.DEPARTMENT || '',
  name: process.env.NAME || '',
  startWork: process.env.STARTWORK || '',
  offWork: process.env.OFFWORK || '',
  startBreak: process.env.STARTBREAK || '',
  offBreak: process.env.OFFBREAK || '',
  workAM: process.env.WORKAM || '',
  workPM: process.env.WORKPM || '',
};

readline.questionSync = (question) => new Promise((resolve, reject) => {
  try {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  } catch (err) {
    reject(err);
  }
});

class ReportManager {
  #doc;

  #inputDirection;

  #outputDirection;

  #config = {
    ...BASE_CONFIG,
    workAM: BASE_CONFIG.workAM.split(',').map((item) => item.trim()),
    workPM: BASE_CONFIG.workPM.split(',').map((item) => item.trim()),
    date: dayjs().format('YYYYMMDD'),
  };

  constructor(inputDirection, outputDirection) {
    this.#inputDirection = inputDirection;
    this.#outputDirection = outputDirection;
    this.#init();
  }

  #init() {
    // Load the docx file as binary content
    const content = fs.readFileSync(this.#inputDirection, 'binary');

    const zip = new PizZip(content);

    this.#doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
  }

  #render() {
    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    this.#doc.render({
      ...this.#config,
      date: dayjs(this.#config.date).format('YYYY/MM/DD'),
    });
  }

  async build() {
    if (!fs.existsSync(path.resolve(__dirname, 'dist'))) {
      fs.mkdir('dist', { recursive: true }, (err) => {
        if (err) throw err;
      });
    }

    const dateType = await readline.questionSync(
      'Date type (1) Specific Date, (2) Range Date\r\n default(1): ',
    );
    const isRange = Number(dateType) === 2;
    if (isRange) {
      const startDate = await readline.questionSync('start date: ');
      const endDate = await readline.questionSync('end date: ');
      console.log('startDate: ', startDate);
      console.log('endDate: ', endDate);
      const dayRange = Math.abs(dayjs(startDate).diff(dayjs(endDate), 'd')) + 1;
      console.log('Range of day ', dayRange);
      for (let i = 0; i < dayRange; i += 1) {
        this.#config.date = dayjs(startDate).add(i, 'd').format('YYYYMMDD');
        console.log(`report date is ${this.#config.date}`);
        this.#render();
        this.#build();
        this.#init();
      }
    } else {
      const date = await readline.questionSync('repor date: ');
      this.#config.date = dayjs(date).format('YYYYMMDD');
      console.log(`report date is ${this.#config.date}`);
      this.#render();
      this.#build();
    }
    readline.close();
  }

  #build() {
    console.log('start building report.');
    const buf = this.#doc.getZip().generate({
      type: 'nodebuffer',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    });

    const outputPath = this.#outputDirection.replace(
      /\[.*?\]/gm,
      (match) => this.#config[match.slice(1, -1)] ?? match,
    );
    console.log('report location: ', outputPath);
    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(outputPath, buf);
  }
}

new ReportManager(
  path.resolve(__dirname, 'template.docx'),
  path.resolve(__dirname, 'dist/[name]_[department]_[date].docx'),
).build();
