import { Expense, MyQuery } from "types"
import { isSuperset } from "utils"

type ExpenseFilter = (query: MyQuery, expense: Expense) => boolean;

export const hasTags: ExpenseFilter = (query, expense) => {
    return isSuperset(new Set(expense.tags), new Set(query.tags));
}

export const notHaveTags: ExpenseFilter = (query, expense) => {
    const expenseTags = new Set(expense.tags)
    for (const tag of query.notTags) {
        if (expenseTags.has(tag)) {
            return false;
        }
    }
    return true;
}

export const matchesName: ExpenseFilter = (query, expense) => {
    return expense.name.toLowerCase().includes(query.name.toLowerCase());
}
