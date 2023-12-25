import * as fs from 'fs';
import { sum } from './enumerable';

interface ICard {
    cardId: number,
    winningNumbers: string[],
    yourNumbers: string[],
    priseCards: ICard[],
    priseTotal: number,
}

const input = fs.readFileSync('./4.txt', 'utf-8');

const inputCards: [number, ICard][] = [...input.matchAll(/(\d+):(.+)\|(.+)/g)].map(c => {
    const id = +c[1];
    return [id, {
        cardId: id,
        winningNumbers: [...c[2].match(/\d+/g)],
        yourNumbers: [...c[3].match(/\d+/g)],
        priseCards: [],
        priseTotal: 1,
    }]
});

// start with last card
const cardCache = new Map<number, ICard>(inputCards.reverse());

const process = (card: ICard) => {
    const matchingNumbers = card.yourNumbers.filter(n => card.winningNumbers.includes(n));
    const priseCardIds = [...Array(matchingNumbers.length).keys()].map(x => card.cardId + x + 1);
    
    for (const id of priseCardIds) {
        card.priseTotal += cardCache.get(id).priseTotal;
    }
    return card.priseTotal;
}

cardCache.forEach(c => process(c))

console.table(inputCards);

console.log(sum([...cardCache.values()].map(c => c.priseTotal)));

