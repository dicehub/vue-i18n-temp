//
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const YAML = require('yaml');
const fsExtra = require('fs-extra');
const globWatcher = require('glob-watcher');

//
const filenameRegex = /(.+)\/lang\/([a-z-_]+)\.(ya?ml)$$/;

//
function getFilesMapContent(paths) {
  return new Promise((res, rej) => {
    glob(paths, (err, files) => {
      if (err) {
        rej(err);
      }

      /**
       * {
       *   en: [ ['filename', 'content'], []... ]
       * }
       */
      const langs = {};

      files.forEach((path) => {
        const [fullPath, dirPath, lang] = filenameRegex.exec(path);

        if (!langs[lang]) {
          langs[lang] = [];
        }

        const content = fs.readFileSync(path, { encoding: 'utf8' });
        let data = null;

        try {
          data = YAML.parse(content);
        } catch (e) {
          console.error(e);
        }

        if (data) {
          langs[lang].push([
            dirPath,
            data
          ]);
        }
      });

      res(langs);
    })
  })
}

function outputData(dist, lang, data) {
  fsExtra.ensureDirSync(dist);
  fsExtra.outputJsonSync(path.resolve(dist, `${lang}.json`), data);
}

async function collect({ paths, dist, collector }) {
  const maps = await getFilesMapContent(`{${paths.join(',')}}`);
  const outputLangs = {};

  for (const lang in maps) {
    outputLangs[lang] = maps[lang].map((fileMap) => {
      return collector(fileMap[0], lang, fileMap[1]);
    });
  }

  for (const lang in outputLangs) {
    outputData(dist, lang, outputLangs[lang]);
  }
}

module.exports = ({ watch, paths, dist, collector }) => {
  collect({ paths, dist, collector });

  if (watch) {
    const options = {
      usePolling: true,
      interval: 1000,
    };

    globWatcher(paths, options, async (done) => {
      console.log('Langs updated.');
      await collect({ paths, dist, collector });
      done();
    })
  }
}
