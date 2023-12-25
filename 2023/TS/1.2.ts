import * as fs from 'fs';
import { sum } from './enumerable';

const input = fs.readFileSync('./1.txt', 'utf-8').split('\r\n');

const resolve = (value: string): string => {
    switch (value) {
        case 'one':
            return '1';
        case 'two':
            return '2';
        case 'three':
            return '3';
        case 'four':
            return '4';
        case 'five':
            return '5';
        case 'six':
            return '6';
        case 'seven':
            return '7';
        case 'eight':
            return '8';
        case 'nine':
            return '9';
        default:
            return value;
    }
}

//in JS look ahead (?=...) returns meaningfull results when combined with capturing groups, hence usage of matchAll
const coordinates = input.map(s => s.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g))
    .map(s => [...s].map(m => m[1]))    //map capturing groups
    .map(d => +(resolve(d[0])+resolve(d[d.length-1])));
const sumOfCoordinates = sum(coordinates);

console.log(sumOfCoordinates);


/*
const coordinates = input.map((x, i) => ({i, original: x})).slice(11, 20)
    .map(s => ({...s, matches: s.original.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g)}))
    .map(d => ({...d, matches: [...d.matches].map(m => m[1])}))
    .map(d => [d.i, d.original, d.matches[0], d.matches[d.matches.length-1]]);

console.table(coordinates);
*/