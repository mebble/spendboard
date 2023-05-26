import { Expense, Result } from "types";

export interface INotion {
    getExpensesBetween(from: Date, to: Date): Promise<Result<Expense[], NotionError>>;
    getCategories(): Promise<Result<Category[], NotionError>>;
}

export type NotionResponse = {
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

export type Category = {
    name: string;
    color: string;
};

export type NotionError = {
    data: {
        code: string;
        message: string;
    },
    status: number;
    statusText: string;
};

export type NotionDBSchema = {
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
