import * as fs from 'fs';
import { product } from './enumerable';

interface IStat {
    raceDuration: number,
    distanceRecord: number,
}

const input = fs.readFileSync('./6.txt', 'utf-8');

const statistics = input.replace(/\s+/g, '').match(/\d+/g)
    .map(x => +x)
    .reduce((stats,x,i,array)=> {
        const half=array.length/2;
        if(i<half)
            return [...stats, ({raceDuration: x, distanceRecord: 0})];
        else {
            const stat=stats[i-half];
            stats[i-half]=({...stat, distanceRecord: x});
            return stats;
        }
    }, <IStat[]>[]);
    
console.table(statistics);

const waysToWin = statistics.map(s => {
    let waysToWin = 0;
    for (let velocity = 1; velocity<s.raceDuration; velocity++) {
        const timeLeft = s.raceDuration - velocity;
        if(timeLeft * velocity > s.distanceRecord)
            waysToWin++;
    }
    return waysToWin;
});

console.table(waysToWin);
console.log(product(waysToWin));

