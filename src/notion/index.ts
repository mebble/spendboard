import { BackendSrv } from "@grafana/runtime";
import { Expense, Result } from "types";
import { Category, INotion, NotionDBSchema, NotionError, NotionResponse } from "./types";
import { endOfDay, startOfDay } from "utils";

export class Notion implements INotion {
    constructor(
        private readonly backend: BackendSrv,
        private readonly baseUrl: string,
    ) {}

    async getExpensesBetween(from: Date, to: Date): Promise<Result<Expense[], NotionError>> {
        try {
            const response = await this.backend.post<NotionResponse>(`${this.baseUrl}/expenses/query`, {
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
            })
            const expenses: Expense[] = response.results.map((result) => ({
                name: result.properties.Name.title[0].plain_text,
                amount: result.properties.Amount.number,
                date: new Date(result.properties.Date.date.start),
                tags: result.properties.Category.multi_select.map((t) => t.name),
            }));
            return { success: true, data: expenses }
        } catch (error) {
            return { success: false, error: error as NotionError }
        }
    }

    async getCategories(): Promise<Result<Category[], NotionError>> {
        try {
            const response = await this.backend.get<NotionDBSchema>(`${this.baseUrl}/expenses`)
            return { success: true, data: response.properties.Category.multi_select.options };
        } catch (error) {
            return { success: false, error: error as NotionError };
        }
    }
}
