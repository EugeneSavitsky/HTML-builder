const path = require('path');
const { readdir, copyFile, mkdir, rm } = require('fs/promises');

const from = path.join(__dirname, 'files');
const to = path.join(__dirname, 'files-copy');
copyDir(from, to);

async function copyDir(origin, copy) {
  
  try {
    await rm(copy, {recursive: true, force: true});
    await mkdir(copy, { recursive: true });
    const files = await readdir(origin , {withFileTypes: true});
    
    files.forEach(file => {
      copyFile(path.join(origin, file.name), path.join(copy, file.name));
    });

  } catch (err) {
    console.log(err);
  }
}
