import { Result, Expense } from "types";
import { Category, INotion, NotionError } from "./types";
import { endOfDay, startOfDay } from "utils";

export class NotionCache implements INotion {
    private readonly cache: Map<String, Expense[]> = new Map();

    constructor(
        private readonly notion: INotion,
    ) {}

    async getExpensesBetween(from: Date, to: Date): Promise<Result<Expense[], NotionError>> {
        const key = this.cacheKey(from, to);
        if (this.cache.has(key)) {
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

    private cacheKey(from: Date, to: Date): String {
        const fromString = startOfDay(from).toISOString();
        const toString = endOfDay(to).toISOString();
        return fromString + toString;
    }
}
