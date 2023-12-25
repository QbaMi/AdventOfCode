import * as fs from 'fs';
import { sum } from './enumerable';

const assummedBagContents: Map<string, number> = new Map([['red', 12], ['green', 13], ['blue', 14]]);

const isGamePossible = (results: Map<string, number>[]): boolean => 
    results.every(r => [...r].every(([key, value]) => {
        return assummedBagContents.get(key) >= value;
    }));

const input = fs.readFileSync('./2.txt', 'utf-8');

const games = [...input.matchAll(/(\d+): (.+)/g)].map(g => ({gameId: +g[1], results: g[2].split(';')}))
    .map(g => ({...g, results: g.results.map(r => new Map([...r.matchAll(/(\d+) (\w+)/g)].map(x => [x[2], +x[1]])))}))
    .map(g => ({...g, isPossible: isGamePossible(g.results)}));

const possibleGames = games.filter(g => g.isPossible)
const sumOfPossibleGameIds = sum(possibleGames.map(g => g.gameId));

console.log(sumOfPossibleGameIds);
