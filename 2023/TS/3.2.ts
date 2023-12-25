import * as fs from 'fs';
import { product, sum } from './enumerable';

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

const isPartNumber = (number: {value: string, columnIndex: number, rowIndex: number}, symbols: {columnIndex: number, rowIndex: number}[]) : boolean => {
    return symbols.some(s => s.columnIndex >= number.columnIndex - 1 && s.columnIndex <= number.columnIndex + number.value.length &&
                        s.rowIndex >= number.rowIndex - 1 && s.rowIndex <= number.rowIndex + 1);
}

const toGearPartNumbers = (symbol: {value: string, columnIndex: number, rowIndex: number}, numbers: {value: string, columnIndex: number, rowIndex: number}[]): string[]|null => {
    if(symbol.value !== '*') return null;
    const partNumbers = numbers.filter(n => isPartNumber(n, [symbol]));
    if(partNumbers.length !== 2) return null;
    return partNumbers.map(p => p.value);
}

const gearsNumbers = engineSchematics.symbols.map(s => toGearPartNumbers(s, engineSchematics.numbers))
    .filter(n => n !== null);

console.table(gearsNumbers);

const sumOfGearRatios = sum(gearsNumbers.map(g => product(g.map(n => +n))));

console.log(sumOfGearRatios);