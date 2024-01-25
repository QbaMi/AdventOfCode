import * as fs from 'fs';

const input = fs.readFileSync('./8.txt', 'utf-8');

const directions = input.match(/\w+/g)[0];
const nodes = [...input.matchAll(/(\w{3}).{4}(\w{3}), (\w{3})/g)]
    .map(x => ({id: x[1], left: x[2], right: x[3]}));

//console.log(directions);
//console.table(nodes);


const nextIndex = (i: number) => i < directions.length - 1 ? i + 1 : 0; 

const navigate = (): number => {
    let currentNode = nodes.find(x => x.id === 'AAA');
    let currentDirectionIndex = 0;
    let stepCount = 0;
    
    while(true) {
        if (currentNode.id === 'ZZZ') return stepCount;
        const currentDirection = directions[currentDirectionIndex];
        const nextNodeId = currentDirection === 'L' ? currentNode.left : currentNode.right;
        currentNode = nodes.find(x => x.id === nextNodeId);
        currentDirectionIndex = nextIndex(currentDirectionIndex);
        stepCount++;
    }
}

const stepCount = navigate();

console.log(stepCount);