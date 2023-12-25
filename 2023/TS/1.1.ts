import * as fs from 'fs';
import { sum } from './enumerable';

const input = fs.readFileSync('./1.txt', 'utf-8').split('\r\n');

const coordinates = input.map(s => s.match(/\d/g)).map(d => +(d[0]+d[d.length-1]));
const sumOfCoordinates = sum(coordinates);

console.log(sumOfCoordinates);

