import * as fs from 'fs';
import { sum } from './enumerable';
import { A } from '@mobily/ts-belt';

const input = fs.readFileSync('./7.txt', 'utf-8');

enum HandType { fiveOfKind = 6, fourOfKind = 5, full = 4, threeOfKind = 3, twoPair = 2, onePair = 1, highCard = 0 };

const handToType = (hand: string): [HandType, number] =>{
    const labelGroups = A.groupBy(hand.split(''), x => x);
    const jokerCount = labelGroups['J']?.length ?? 0;
    const keys = Object.keys(labelGroups);
    const values = Object.values(labelGroups);
    if (keys.length === 1) return [HandType.fiveOfKind, jokerCount]; // all five cards have the same label
    if (keys.length === 2){
        if (values.some(g => g.length === 4)) return [HandType.fourOfKind, jokerCount]; // four cards have the same label and one card has a different label
        if (values.some(g => g.length === 3)) return [HandType.full, jokerCount]; // three cards have the same label, and the remaining two cards share a different label
    }
    if (keys.length === 3){
        if (values.some(g => g.length === 3)) return [HandType.threeOfKind, jokerCount]; // three cards have the same label, and the remaining two cards are each different from any other card in the hand
        if (values.some(g => g.length === 2)) return [HandType.twoPair, jokerCount];  // two cards share one label, two other cards share a second label, and the remaining card has a third label
    }
    if (keys.length === 4) return [HandType.onePair, jokerCount]; // two cards share one label, and the other three cards have a different label from the pair and each other
    else return [HandType.highCard, jokerCount]; // all cards' labels are distinct
}

const handToTypeWithJokers = (hand: string) => {
    const [handType, jokerCount] = handToType(hand);

    if(jokerCount === 0) return handType;

    switch (handType) {
        case HandType.fiveOfKind:
        case HandType.fourOfKind:
        case HandType.full:
            return HandType.fiveOfKind;
        case HandType.threeOfKind:
            switch (jokerCount) {
                case 2:
                    return HandType.fiveOfKind;
                case 1:
                case 3:
                    return HandType.fourOfKind;
            }
        case HandType.twoPair:
            return jokerCount === 1 ? HandType.full : HandType.fourOfKind;
        case HandType.onePair:
            return HandType.threeOfKind;
        case HandType.highCard:
            return HandType.onePair;
    }
}

const labelToValue = (label: string): number => {
    const value = +label;
    if(!Number.isNaN(value)) return value;
    if(label === 'T') return 10;
    if(label === 'J') return 1; 
    if(label === 'Q') return 12;
    if(label === 'K') return 13;
    if(label === 'A') return 14;
}

const hands = [...input.matchAll(/(.{5}) (\d+)/g)]
    .map(x => ({hand: x[1], bid: +x[2], handType: handToTypeWithJokers(x[1])}))
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


