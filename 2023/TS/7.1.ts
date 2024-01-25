import * as fs from 'fs';
import { sum } from './enumerable';
import { A } from '@mobily/ts-belt';

const input = fs.readFileSync('./7.txt', 'utf-8');

enum handType { fiveOfKind = 6, fourOfKind = 5, full = 4, threeOfKind = 3, twoPair = 2, onePair = 1, highCard = 0 };

const handToType = (hand: string): handType =>{
    const labelGroups = A.groupBy(hand.split(''), x => x);
    const keys = Object.keys(labelGroups);
    const values = Object.values(labelGroups);
    if (keys.length === 1) return handType.fiveOfKind; // all five cards have the same label
    if (keys.length === 2){
        if (values.some(g => g.length === 4)) return handType.fourOfKind; // four cards have the same label and one card has a different label
        if (values.some(g => g.length === 3)) return handType.full; // three cards have the same label, and the remaining two cards share a different label
    }
    if (keys.length === 3){
        if (values.some(g => g.length === 3)) return handType.threeOfKind; // three cards have the same label, and the remaining two cards are each different from any other card in the hand
        if (values.some(g => g.length === 2)) return handType.twoPair;  // two cards share one label, two other cards share a second label, and the remaining card has a third label
    }
    if (keys.length === 4) return handType.onePair; // two cards share one label, and the other three cards have a different label from the pair and each other
    else return handType.highCard; // all cards' labels are distinct
}

const labelToValue = (label: string): number => {
    const value = +label;
    if(!Number.isNaN(value)) return value;
    if(label === 'T') return 10;
    if(label === 'J') return 11;
    if(label === 'Q') return 12;
    if(label === 'K') return 13;
    if(label === 'A') return 14;
}

const hands = [...input.matchAll(/(.{5}) (\d+)/g)]
    .map(x => ({hand: x[1], bid: +x[2], handType: handToType(x[1])}))
    .sort((h1 , h2) => {
        if(h1.handType < h2.handType) return -1;
        if(h1.handType > h2.handType) return 1;
        for (let i = 0; i < 5; i++) {
            if(labelToValue(h1.hand[i]) < labelToValue(h2.hand[i])) return -1;
            if(labelToValue(h1.hand[i]) > labelToValue(h2.hand[i])) return 1;
        }
        return 0;
    });
    
console.table(hands);

console.log(sum(hands.map((h, i) => h.bid * (i + 1))))


