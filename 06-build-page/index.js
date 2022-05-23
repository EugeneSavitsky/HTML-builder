const fs = require('fs');
const path = require('path');
const { readdir, readFile, copyFile, mkdir, rm, writeFile } = require('fs/promises');

const fromAssets = path.join(__dirname, 'assets');
const fromStyles = path.join(__dirname, 'styles');
const toProjectDist = path.join(__dirname, 'project-dist');
const toProjectDistAssets = path.join(__dirname, 'project-dist', 'assets');
const componentsDir = path.join(__dirname, 'components');

let accumOfStyles = [];

mergeStyles(fromStyles, toProjectDist);
copyAssets(fromAssets, toProjectDistAssets);
constructHTML()

async function copyAssets(sourceDir, targetDir) {
  try {
    await mkdir(targetDir, { recursive: true });
    const files = await readdir(sourceDir , {withFileTypes: true});
      
    files.forEach(file => {
      if(file.isDirectory()) {
        copyAssets(path.join(sourceDir, file.name), path.join(targetDir, file.name));
      } else {
        copyFile(path.join(sourceDir, file.name), path.join(targetDir, file.name));
      }
    });
    console.log(`Assets from ${sourceDir} copied whith no error's`);

  } catch (err) {
    console.log(err);
  }
}

async function mergeStyles(sourceDir, targetDir) {
  try {
    const files = await readdir(sourceDir, {withFileTypes: true});

    for await (const file of files) {
      let fileExtension = file.name.split('.')[1];

      if (file.isFile() && fileExtension === 'css') {
        const stream = fs.createReadStream(path.join(sourceDir, file.name), 'utf-8');
        
        for await (const chunk of stream) {
            accumOfStyles.push(chunk);
        }
      }
    }

    await writeFile(path.join(targetDir, 'style.css'), accumOfStyles.join(''), 'utf-8');
    console.log(`Styles merged whith no error's`);

  } catch (error) {
    console.log(error);
  }
}

async function constructHTML() {
    
    try {
        let templateFile = await readFile(path.join(__dirname, 'template.html'));
        templateFile = templateFile.toString();
        const accumOfComponents = [];
        const componentFiles = await readdir(componentsDir, {withFileTypes: true});

      for await (const component of componentFiles) {
        const componentName = component.name.split('.')[0];
        const templateFile = fs.createReadStream(path.join(componentsDir, component.name), 'utf-8');
        let text = '';
  
        for await (const chunk of templateFile) {
          text += chunk;
        }
  
        accumOfComponents.push({ 
          name: componentName,
          value: text
        });
      }
  
      for (const component of accumOfComponents) {
  
        if (templateFile.includes(`{{${component.name}}}`)){
          const templateFragment = templateFile.split(`{{${component.name}}}`);
          templateFile = templateFragment[0] + component.value + templateFragment[1];
        }
      }
  
      await writeFile(path.join(toProjectDist, 'index.html'), templateFile, 'utf-8');
      console.log(`Html construct whith no error's`);
    } catch (error) {
      console.log(error);
    }
  }