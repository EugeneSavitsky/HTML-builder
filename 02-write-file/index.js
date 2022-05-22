const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout, exit} = process;

const write = fs.createWriteStream(path.join(__dirname, 'data.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  output: write
});
stdout.write('Hellow, write some data:\n'); 
rl.on('line', (text) => {
  text.trim().toLowerCase() === 'exit'? process.exit(0) : write.write(`${text}\n`);
});
process.on('SIGINT', () => {
  process.exit(1);
});
process.on('exit', (code) => {
  code !== 0 ? stdout.write('\nUse hotkey Ctrl + C\nGood bye') : stdout.write('\nUse keyword "exit"\nGood bye'); 
});