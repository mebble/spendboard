import { Result, Expense } from "types";
import { Category, INotion, NotionError } from "./types";
import { endOfDay, sleep, startOfDay } from "utils";
import { isBefore, isAfter, isSameDay } from "date-fns";

export class NotionCache implements INotion {
    private readonly cache: Map<string, Expense[]> = new Map();

    constructor(
        private readonly notion: INotion,
    ) {}

    async getExpensesBetween(from: Date, to: Date): Promise<Result<Expense[], NotionError>> {
        const key = cacheKey(from, to);
        if (this.cache.has(key)) {
            await sleep(500);
            return { success: true, data: this.cache.get(key)! }
        }
        const result = await this.notion.getExpensesBetween(from, to);
        if (result.success) {
            this.cache.set(key, result.data);
        }
        return result;
    }

    getCategories(): Promise<Result<Category[], NotionError>> {
        return this.notion.getCategories();
    }

}

type Range = [Date, Date];

export class RangeCache implements INotion {
    private readonly cache: Map<string, Expense[]> = new Map();

    constructor(
        private readonly notion: INotion,
    ) {}

    async getExpensesBetween(from: Date, to: Date): Promise<Result<Expense[], NotionError>> {
        const range: Range = [from, to];
        if (this.has(range)) {
            await sleep(500);
            return { success: true, data: this.get(range) }
        }
        const result = await this.notion.getExpensesBetween(from, to);
        if (result.success) {
            this.set(range, result.data);
        }
        return result;
    }

    getCategories(): Promise<Result<Category[], NotionError>> {
        return this.notion.getCategories();
    }

    private has(range: Range): boolean {
        const key = this.matchingKey(range);
        return key !== undefined;
    }

    private get(range: Range): Expense[] {
        const key = this.matchingKey(range);
        if (key === undefined) {
            return [];
        }

        const expenses = this.cache.get(key)!;
        return expenses.filter(e => dateBetween(range, e.date));
    }

    private set(newRange: Range, newData: Expense[]): void {
        const keys = Array.from(this.cache.keys()).filter(key => {
            const range = parseKey(key);
            return overlap(newRange, range);
        })

        let mergedRange = newRange;
        let mergedKey = rangeCacheKey(mergedRange);
        let mergedData = newData;
        for (const key of keys) {
            const range = parseKey(key);
            const data = this.cache.get(key)!;

            mergedData = isBefore(mergedRange[0], range[0])
                ? mergedData.concat(data.filter(d => isAfter(d.date, mergedRange[1]))) 
                : data.concat(mergedData.filter(d => isAfter(d.date, range[1])));
            mergedRange = merge(mergedRange, range)
            mergedKey = rangeCacheKey(mergedRange)

            this.cache.delete(key)
        }
        this.cache.set(mergedKey, mergedData);
    }
    
    private matchingKey(newRange: Range): string | undefined {
        for (const key of this.cache.keys()) {
            const range = parseKey(key);
            if (rangeWithin(newRange, range)) {
                return key;
            }
        }
        return undefined;
    }
}

function parseKey(key: string): Range {
    return key.split(':::').map(d => new Date(d)) as Range;
}

function cacheKey(from: Date, to: Date): string {
    const fromString = startOfDay(from).toISOString();
    const toString = endOfDay(to).toISOString();
    return fromString + toString;
}

function rangeCacheKey(range: Range): string {
    const [from, to] = range;
    const fromString = startOfDay(from).toISOString();
    const toString = endOfDay(to).toISOString();
    return fromString + ':::' + toString;
}

function dateBetween(range: Range, date: Date) {
    const [start, end] = range;
    return isSameDay(date, start)
        || isSameDay(date, end)
        || (isAfter(date, start) && isBefore(date, end));
}

function rangeWithin(subRange: Range, superRange: Range): boolean {
    const [f1, t1] = subRange;
    const [f2, t2] = superRange;
    return (isSameDay(f1, f2) || isAfter(f1, f2))
        && (isSameDay(t1, t2) || isBefore(t1, t2));
}

function overlap(range1: Range, range2: Range) {
    const [from, to] = range1;
    return dateBetween(range2, from) || dateBetween(range2, to);
}

function merge(range1: Range, range2: Range): Range {
    const datesInMillis = [...range1, ...range2].map(d => d.getTime())
    const from = new Date(Math.min(...datesInMillis));
    const to = new Date(Math.max(...datesInMillis));
    return [from, to];
}
