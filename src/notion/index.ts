import { BackendSrv } from "@grafana/runtime";
import { Expense, Result } from "types";
import { Category, INotion, NotionDBSchema, NotionError, NotionResponse, NotionResult } from "./types";
import { endOfDay, startOfDay } from "utils";

export class Notion implements INotion {
    constructor(
        private readonly backend: BackendSrv,
        private readonly baseUrl: string,
    ) {}

    async getExpensesBetween(from: Date, to: Date): Promise<Result<Expense[], NotionError>> {
        const response = await this.getPages(from, to);
        if (!response.success) {
            return response;
        }

        const expenses: Expense[] = response.data.map((result) => ({
            name: result.properties.Name.title[0].plain_text,
            amount: result.properties.Amount.number,
            date: new Date(result.properties.Date.date.start),
            tags: result.properties.Category.multi_select.map((t) => t.name),
        }));
        return { success: true, data: expenses }
    }

    async getCategories(): Promise<Result<Category[], NotionError>> {
        try {
            const response = await this.backend.get<NotionDBSchema>(`${this.baseUrl}/expenses`)
            return { success: true, data: response.properties.Category.multi_select.options };
        } catch (error) {
            return { success: false, error: error as NotionError };
        }
    }

    private async getPages(from: Date, to: Date): Promise<Result<NotionResult[], NotionError>> {
        const allResults: NotionResult[] = [];
        let hasNext = true;
        let cursor: string | undefined;
        while (hasNext) {
            const response = await this.getPage(requestOptions(from, to, cursor));
            if (!response.success) {
                return response;
            }
            const { results, has_more } = response.data;
            allResults.push(...results);
            hasNext = has_more;
            if (has_more) {
                cursor = response.data.next_cursor;
            }
        }

        return { success: true, data: allResults }
    }

    private async getPage(options: any): Promise<Result<NotionResponse, NotionError>> {
        try {
            const response = await this.backend.post<NotionResponse>(`${this.baseUrl}/expenses/query`, options);
            return { success: true, data: response }
        } catch (error) {
            return { success: false, error: error as NotionError }
        }
    }
}

function requestOptions(from: Date, to: Date, cursor: string | undefined) {
    const baseOptions = {
        filter: {
            and: [
                { property: 'Date', date: { on_or_after: startOfDay(from).toISOString() } },
                { property: 'Date', date: { on_or_before: endOfDay(to).toISOString() } },
            ],
        },
        sorts: [
            {
                property: 'Date',
                direction: 'ascending',
            },
        ],
    };
    return cursor
        ? { ...baseOptions, start_cursor: cursor }
        : baseOptions;
}
