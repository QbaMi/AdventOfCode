import * as fs from 'fs';
import { sum, product } from './enumerable';

const toMinimumSet = (results: Map<string, number>[]): Map<string, number> => {
    const minimumSet = new Map<string, number>();
    
    results.forEach(r => [...r].forEach(([key, value]) => {
        const storedValue = minimumSet.get(key);
        if(storedValue === undefined || storedValue < value) minimumSet.set(key, value);
    }))

    return minimumSet;
}

const input = fs.readFileSync('./2.txt', 'utf-8');

const games = [...input.matchAll(/(\d+): (.+)/g)].map(g => ({gameId: +g[1], results: g[2].split(';')}))
    .map(g => ({...g, results: g.results.map(r => new Map([...r.matchAll(/(\d+) (\w+)/g)].map(x => [x[2], +x[1]])))}))
    .map(g => ({...g, minimumSet: toMinimumSet(g.results)}));


const sumOfPowers = sum(games.map(g => product([...g.minimumSet].map(([_, value]) => value))));

console.log(sumOfPowers);
