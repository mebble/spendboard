import { Expense } from "types";
import { ExpenseDepreciate, depreciating } from "./transforms"
import { fromPartial } from "@total-typescript/shoehorn";

describe('depreciating', () => {
    test('happy path', () => {
        const expenses: Expense[] = [
            fromPartial({ date: new Date('2023-06-01'), amount: 100 }),
            fromPartial({ date: new Date('2023-06-03'), amount: 100 }),
            fromPartial({ date: new Date('2023-06-07'), amount: 100 }),
        ];
        const expected: ExpenseDepreciate[] = [
            fromPartial({ date: new Date('2023-06-01'), amount: 100, costPerDay: 50 }),
            fromPartial({ date: new Date('2023-06-03'), amount: 100, costPerDay: 25 }),
        ];
        const actual = depreciating(expenses);

        expect(actual).toEqual(expected);
    })
})
