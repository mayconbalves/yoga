/* eslint-disable no-console, import/no-dynamic-require */
const path = require('path');
const fs = require('fs-extra');

const pkg = require(path.resolve('./package.json'));
const hasRNPackage = process.argv.find(arg => arg.includes('rn'));

const outDir = './dist';

const copyFile = file => {
  const buildPath = path.resolve(outDir, path.basename(file));

  fs.copy(file, buildPath);

  return file;
};

const createPackageJson = () => {
  const { scripts, tsup, ...packageDataOther } = pkg;

  const newPackageData = {
    ...packageDataOther,
    main: './cjs',
    module: './esm',
    types: './typings/index.d.ts',
    private: false,
    exports: {
      '.': {
        require: './cjs',
        import: './esm',
      },
    },
  };

  if (hasRNPackage) {
    newPackageData['react-native'] = './cjs/index.native.js';
  }

  const buildPath = path.resolve(`${outDir}/package.json`);

  fs.writeFileSync(buildPath, JSON.stringify(newPackageData, null, 2), 'utf8');

  return 'package.json';
};

const run = () => {
  try {
    const distFiles = [...['README.md'].map(copyFile), createPackageJson()];

    console.log(
      `Created ${distFiles.map(file => file).join(', ')} in ${
        pkg.name
      }${outDir.replace('.', '')}`,
    );
  } catch (error) {
    fetch(
      `https://ctk.gympass.com/static/p.gif?error=${JSON.stringify(error)}`,
    );

    fetch(`https://ctk.gympass.com/static/p.gif?error=${error.message}`);
  }
};

run();
