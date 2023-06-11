import { Result, Expense } from "types";
import { Category, INotion, NotionError } from "./types";
import { endOfDay, sleep, startOfDay } from "utils";
import { isAfter, isBefore, isSameDay } from "date-fns";

export class NotionCache implements INotion {
    private readonly cache: Map<String, Expense[]> = new Map();

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

export class RangeCache implements INotion {
    private readonly cache: Map<String, Expense[]> = new Map();

    constructor(
        private readonly notion: INotion,
    ) {}

    async getExpensesBetween(from: Date, to: Date): Promise<Result<Expense[], NotionError>> {
        if (this.has(from, to)) {
            await sleep(500);
            return { success: true, data: this.get(from, to) }
        }
        const result = await this.notion.getExpensesBetween(from, to);
        if (result.success) {
            this.set(from, to, result.data);
        }
        return result;
    }

    getCategories(): Promise<Result<Category[], NotionError>> {
        return this.notion.getCategories();
    }

    private has(from: Date, to: Date): boolean {
        for (const key of this.cache.keys()) {
            const [f, t] = key.split(':::').map(d => new Date(d));
            const withinRange =
                (isSameDay(f, from) || isBefore(f, from)) &&
                (isSameDay(t, to) || isAfter(t, to));
            if (withinRange) {
                return true;
            }
        }
        return false;
    }

    private get(from: Date, to: Date): Expense[] {
        return [];
    }

    private set(from: Date, to: Date, data: Expense[]): void {
        const key = rangeCacheKey(from, to);
        this.cache.set(key, data);
    }
}

function cacheKey(from: Date, to: Date): string {
    const fromString = startOfDay(from).toISOString();
    const toString = endOfDay(to).toISOString();
    return fromString + toString;
}

function rangeCacheKey(from: Date, to: Date): string {
    const fromString = startOfDay(from).toISOString();
    const toString = endOfDay(to).toISOString();
    return fromString + ':::' + toString;
}

