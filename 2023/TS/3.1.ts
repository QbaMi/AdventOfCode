import * as fs from 'fs';
import { sum } from './enumerable';

const input = fs.readFileSync('./3.txt', 'utf-8').split('\r\n');

const engineSchematics = input.map((i, index) => ({
    numbers: [...i.matchAll(/\d+/g)].map(n => ({
        value: n[0],
        columnIndex: n.index,
        rowIndex: index,
    })),
    symbols: [...i.matchAll(/[^\d\.]/g)].map(s => ({
        value: s[0],
        columnIndex: s.index,
        rowIndex: index,
    }))})).reduce((engineSchematics, schematic) => ({
        numbers: [...engineSchematics.numbers, ...schematic.numbers],
        symbols: [...engineSchematics.symbols, ...schematic.symbols],
    }), ({numbers: [], symbols: []}));

const isPartNumber = (number: {value: string, columnIndex: number, rowIndex: number}, symbols: {columnIndex: number, rowIndex: number}[]) : boolean =>
    symbols.some(s => s.columnIndex >= number.columnIndex - 1 && s.columnIndex <= number.columnIndex + number.value.length &&
                 s.rowIndex >= number.rowIndex - 1 && s.rowIndex <= number.rowIndex + 1);

const engineNumbers = engineSchematics.numbers.filter(n => isPartNumber(n, engineSchematics.symbols));

//console.table(engineNumbers.map(e => e.value));

const sumOfEngineNumbers = sum(engineNumbers.map(e => +e.value));

console.log(sumOfEngineNumbers);