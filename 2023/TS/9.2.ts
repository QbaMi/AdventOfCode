import * as fs from 'fs';
import { sum } from "./enumerable";

const input = fs.readFileSync('./9.txt', 'utf-8').split('\r\n');

const oasisReadings = input.map(x => x.match(/(-*\d+)/g).map(d => +d));

//console.table(oasisReadings);

const extrapolate = (readings: number[])  => {
    const differences = [readings];

    for (let level = 1; ; level++) {
        differences.push([]);
        for (let i = 0; i < differences[level - 1].length - 1; i++) {
            const [a, b] = differences[level - 1].slice(i, i + 2);
            differences[level].push(b - a);
        }
        if (differences[level].every(x => x === 0)) break;
    }

    for (let level = differences.length - 2; level >= 0; level--) {
        differences[level] = [differences[level][0] - differences[level + 1][0], ...differences[level]];
    }

    return differences[0][0];
}

const extrapolations = oasisReadings.map(x => extrapolate(x))

console.log(sum(extrapolations));