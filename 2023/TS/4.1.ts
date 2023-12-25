import * as fs from 'fs';
import { sum } from './enumerable';

const input = fs.readFileSync('./4.txt', 'utf-8');

const cardPoints = [...input.matchAll(/:(.+)\|(.+)/g)].map(c => {
    const winningNumbers = [...c[1].match(/\d+/g)];
    const yourNumbers = [...c[2].match(/\d+/g)];
    const matchingNumbers = yourNumbers.filter(n => winningNumbers.includes(n));
    return matchingNumbers.length > 0 ? 2 ** (matchingNumbers.length - 1) : 0;
});

console.table(cardPoints);

console.log(sum(cardPoints));

