import * as fs from 'fs';

const input = fs.readFileSync('./8.txt', 'utf-8');

const directions = input.match(/\w+/g)[0];
const nodes = [...input.matchAll(/(\w{3}).{4}(\w{3}), (\w{3})/g)]
    .map(x => ({id: x[1], left: x[2], right: x[3]}));

//console.log(directions);
//console.table(nodes);

interface INode { id: string, left: string, right: string}

const nextIndex = (i: number) => i < directions.length - 1 ? i + 1 : 0; 

const navigate = (node: INode): number => {
    let currentNode = node;
    let currentDirectionIndex = 0;
    let stepCount = 0;
    
    while(true) {
        if (currentNode.id[2] === 'Z') return stepCount;
        const currentDirection = directions[currentDirectionIndex];
        const nextNodeId = currentDirection === 'L' ? currentNode.left : currentNode.right;
        currentNode = nodes.find(x => x.id === nextNodeId);
        currentDirectionIndex = nextIndex(currentDirectionIndex);
        stepCount++;
    }
}

const steps = nodes.filter(x => x.id[2] === 'A')
    .map(x => navigate(x));

const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number) => a * b / gcd(a, b);


const stepCount = steps.reduce(lcm);

console.log(stepCount);