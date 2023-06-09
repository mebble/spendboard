import { Seq } from 'immutable'
import { dateRange } from "utils";
import { Expense } from "types";

export type ExpenseDepreciate = Expense & {
    costPerDay: number;
}

export const depreciating = (expenses: Expense[]): ExpenseDepreciate[] => {
    const seq = Seq(expenses)
    const rest = seq.rest()
    return seq.zip<Expense>(rest)
        .map(([expense, nextExpense]) => {
            const numDays = dateRange(expense.date, nextExpense.date).length;
            return { ...expense, costPerDay: expense.amount / numDays };
        })
        .toArray();
}
