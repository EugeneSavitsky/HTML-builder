const fs = require('fs');
const path = require('path');
const { readdir, writeFile } = require('fs/promises');

let accumOfStyles = [];

const from = path.join(__dirname, 'styles');
const to = path.join(__dirname, 'project-dist');
mergeStyles(from, to);

async function mergeStyles(sourceDir, targetDir) {
  try {
    const files = await readdir(sourceDir, {withFileTypes: true});

    for await (const file of files) {
      let fileExtension = file.name.split('.')[1]

      if (file.isFile() && fileExtension === 'css') {
        const stream = fs.createReadStream(path.join(sourceDir, file.name), 'utf-8');
        
        for await (const chunk of stream) {
            accumOfStyles.push(chunk);
        }
      }
    }

    await writeFile(path.join(targetDir, 'bundle.css'), accumOfStyles.join(''), 'utf-8');
    console.log(`Styles merged whith no error's`);

  } catch (error) {
    console.log(error);
  }
}

