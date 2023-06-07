import "https://deno.land/x/dotenv/load.ts";
import { faker } from "https://cdn.skypack.dev/@faker-js/faker?dts";

const num = 1000;
for (let i = 0; i < num; i++) {
    const expense = randomExpense()
    const res = await postExpense(expense);
    console.log(`[${i}/${num}] ${res.statusText}`);
}

type Expense = {
    name: string;
    amount: number;
    date: Date;
    tags: string[];
}

function randomExpense(): Expense {
    return {
        name: faker.commerce.product(),
        amount: parseInt(faker.commerce.price(), 10),
        date: faker.date.between({
            from: new Date('2022-01-01'),
            to: new Date(),
        }),
        tags: [
            faker.commerce.department(),
            faker.commerce.department(),
            faker.commerce.department(),
        ]
    }
}

function postExpense(expense: Expense) {
    return fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${Deno.env.get('NOTION_TOKEN')}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
            parent: {
                database_id: Deno.env.get('NOTION_DEMO_DB_ID')
            },
            properties: {
                Name: {
                    title: [{
                        text: {
                            content: expense.name
                        }
                    }]
                },
                Date: {
                    date: {
                        start: expense.date.toJSON()
                    }
                },
                Amount: {
                    number: expense.amount
                },
                Category: {
                    multi_select: expense.tags.map(t => ({ name: t }))
                },
                Comment: {
                    rich_text: [{
                        text: {
                            content: ''
                        }
                    }]
                }
            }
        })
    })
}
