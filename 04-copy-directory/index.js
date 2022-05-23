const path = require('path');
const { readdir, copyFile, mkdir, rm } = require('fs/promises');

const from = path.join(__dirname, 'files');
const to = path.join(__dirname, 'files-copy');
copyDir(from, to);

async function copyDir(sourceDir, targetDir) {
  
  try {
    await rm(targetDir, {recursive: true, force: true});
    await mkdir(targetDir, { recursive: true });
    const files = await readdir(sourceDir , {withFileTypes: true});
      
    files.forEach(file => {
      if(file.isDirectory()) {
        copyDir(path.join(sourceDir, file.name), path.join(targetDir, file.name));
      } else {
        copyFile(path.join(sourceDir, file.name), path.join(targetDir, file.name));
        console.log(`File: ${file.name} copied whith no error's`);
      }
    });

  } catch (err) {
    console.log(err);
  }
}