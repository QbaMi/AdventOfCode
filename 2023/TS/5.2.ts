import * as fs from 'fs';
import { min } from './enumerable';

interface IRange {
    first: number,
    last: number,
}

const parseMap = (x: string) => [...x.matchAll(/(\d+) (\d+) (\d+)/g)].map(x => ({destination: {first: +x[1], last: (+x[1])+(+x[3])-1}, source: {first: +x[2], last: (+x[2])+(+x[3])-1}}))

const mapping = (value: number, map: {source: IRange, destination: IRange}[]) => {
    const range = map.filter(x => value >= x.source.first && value <= x.source.last)[0]
    if(!!range)
        return range.destination.first + value - range.source.first;
    return value;
}

function* seedGenerator(first: number, amount: number) {
    const last = first + amount - 1;
    let i = first;
    while(i <= last) {
        yield i;
        i++;
    }
}

const input = fs.readFileSync('./5.txt', 'utf-8').matchAll(/seeds:(.+)seed-to-soil map:(.+)soil-to-fertilizer map:(.+)fertilizer-to-water map:(.+)water-to-light map:(.+)light-to-temperature map:(.+)temperature-to-humidity map:(.+)humidity-to-location map:(.+)/gms);
const almanac = [...input].map(x => ({
    seedRanges: [...x[1].matchAll(/(\d+) (\d+)/g)]
    .map(a => seedGenerator(+a[1], +a[2])),
    seedToSoil: parseMap(x[2]),
    soilToFertilizer: parseMap(x[3]),
    fertilizerTowater: parseMap(x[4]),
    waterToLight: parseMap(x[5]),
    lightToTemperature: parseMap(x[6]),
    temperatureToHumidity: parseMap(x[7]),
    humidityToLocation: parseMap(x[8]),
}))[0]

const result = almanac.seedRanges.map(x => {
    let min = Number.MAX_VALUE;
    for (const seed of x) {
        const location = mapping(mapping(mapping(mapping(mapping(mapping(mapping(seed, almanac.seedToSoil), almanac.soilToFertilizer), almanac.fertilizerTowater), almanac.waterToLight), almanac.lightToTemperature), almanac.temperatureToHumidity), almanac.humidityToLocation)
        if(min > location)
            min = location;
    }
    return min;
});

console.table(result);

console.log(min(result));