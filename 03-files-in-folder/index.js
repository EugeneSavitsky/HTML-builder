const path = require('path');
const {readdir, lstat} = require('fs');
const filePath = path.join(__dirname, 'secret-folder');

readdir(filePath, {withFileTypes: true}, (err, files) => {
    console.log("\nSecret folder files:");
    if (err) {
        console.log(err);
    } else {
        files.forEach(file => {
            if (file.isFile()) {
                let fileFullPath = path.join(filePath, file.name);
                lstat(fileFullPath, (err, stats) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let fileName = path.parse(fileFullPath).name;
                        let extansion = path.extname(fileFullPath).slice(1);
                        let size = stats.size / 1000 +'kb';
                        console.log(`${fileName} - ${extansion} - ${size}`);
                    }
                });
            }
        })
    }
})