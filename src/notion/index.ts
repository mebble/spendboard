import { DateTime } from "@grafana/data";
import { BackendSrv } from "@grafana/runtime";
import { Expense, Result } from "types";

export class Notion {
    constructor(
        private readonly backend: BackendSrv,
        private readonly baseUrl: string,
    ) {}

    async getExpensesBetween(from: DateTime, to: DateTime): Promise<Result<Expense[], NotionError>> {
        try {
            const response = await this.backend.post<NotionResponse>(`${this.baseUrl}/expenses/query`, {
                filter: {
                    and: [
                        { property: 'Date', date: { on_or_after: new Date(from.valueOf()).toISOString() } },
                        { property: 'Date', date: { on_or_before: new Date(to.valueOf()).toISOString() } },
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

type NotionResponse = {
    object: string;
    results: NotionResult[];
    next_cursor: string;
    has_more: boolean;
}

type NotionResult = {
    properties: {
        Name: {
            title: [{
                plain_text: string,
            }]
        },
        Date: {
            date: {
                start: string,
            }
        },
        Amount: {
            number: number,
        },
        Category: {
            multi_select: Category[]
        },
        Comment: {
            rich_text: [{
                plain_text: string,
            }]
        },
    };
}

type Category = {
    name: string;
    color: string;
};

type NotionError = {
    data: {
        code: string;
        message: string;
    },
    status: number;
    statusText: string;
};

type NotionDBSchema = {
    title: [{
        plain_text: string;
    }],
    properties: {
        Category: {
            multi_select: {
                options: Category[]
            }
        }
    }
};
