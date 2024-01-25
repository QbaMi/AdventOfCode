import * as fs from 'fs';

interface ITile {
    key: string,
    x: number,
    y: number,
    distance?: number,
    pipe?: string,
}

interface IStep {
    (x: number, y: number): ITile
}

const toKey = (x, y) => `${x};${y}`;

const getNextTile = (x: number, y: number): ITile => {
    const key = toKey(x, y);

    if(pipeMap.has(key)) return pipeMap.get(key);

    const pipe = sketch[y][x];
    const tile = ({key, x, y, pipe, });

    return tile;
}

const goNorth = (x: number, y: number) => y > 0 ? getNextTile(x, y - 1) : undefined;

const goSouth = (x: number, y: number) => y < sketch.length - 1 ? getNextTile(x, y + 1) : undefined;

const goWest = (x: number, y: number) => x > 0 ? getNextTile(x - 1, y) : undefined;

const goEast = (x: number, y: number) => x < sketch[0].length - 1 ? getNextTile(x + 1, y) : undefined;

const resolvePipe = (pipe: string, source: IStep) => {
    switch(pipe) {
        case '|': return source === goSouth ? goSouth : goNorth;
        case '-': return source === goEast ? goEast : goWest;
        case 'L': return source === goSouth ? goEast : goNorth;
        case 'J': return source === goSouth ? goWest : goNorth;
        case '7': return source === goNorth ? goWest : goSouth;
        case 'F': return source === goNorth ? goEast : goSouth;
        default: undefined;
    }
}

function* crawler(firstStep: IStep){
    let distance = 0;
    let nextStep = firstStep;
    let nextTile = firstStep(startX, startY);
    while(!pipeMap.has(nextTile.key)){
        distance++;
        yield ({ ...nextTile, distance });
        nextStep = resolvePipe(nextTile.pipe, nextStep);
        nextTile = nextStep(nextTile.x, nextTile.y);
    }
    return nextTile;
};

const scanSorundings = (x: number, y: number) => [
        ['7','|','F'].includes(goNorth(x, y)?.pipe) ? crawler(goNorth) : undefined,
        ['J','|','L'].includes(goSouth(x, y)?.pipe) ? crawler(goSouth) : undefined,
        ['J','-','7'].includes(goEast(x, y)?.pipe) ? crawler(goEast) : undefined,
        ['L','-','F'].includes(goWest(x, y)?.pipe) ? crawler(goWest) : undefined,
    ].filter(c => c !== undefined);

function getMaxValue<TKey, TValue>(map: Map<TKey, TValue>, selector: (x: TValue) => number)
{
    let max = 0
    for (const [_, value] of map) {
        const x = selector(value);
        if(max < x) max = x;
    }
    return max;
}

const input = fs.readFileSync('./10.txt', 'utf-8');

const sketch = input.split('\r\n').map(x => x.split(''));

const [startX, startY] = sketch.reduce((location, line, y) => {
    const x = line.indexOf('S');
    if(x !== -1) return [x, y];
    return location;
}, <number[]>[]);

const pipeMap = new Map<string, ITile>([[toKey(startX, startY), ({ key: toKey(startX, startY), x: startX, y: startY, distance: 0 })]]);

const crawlers = scanSorundings(startX, startY);

while(true) {
    const results = crawlers.map(crawler => crawler.next())
        .filter(result => result !== undefined);
    if(results.every(result => result === undefined || result.done)) {
        break;
    }
    results.forEach(result => {
        if(!result.done) pipeMap.set(result.value.key, result.value);
    });
    
}

console.log(getMaxValue(pipeMap, x => x.distance));