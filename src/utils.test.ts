import { dateRange } from "./utils";

describe('dateRange', () => {
    test("generate dates between two dates", () => {
        const begin = new Date('2022-08-01');
        const end = new Date('2022-08-05');
        const expected = [
            new Date('2022-08-01'),
            new Date('2022-08-02'),
            new Date('2022-08-03'),
            new Date('2022-08-04'),
            new Date('2022-08-05')
        ];
        expect(dateRange(begin, end)).toEqual(expected);
    });

    test("across a month", () => {
        const begin = new Date('2023-02-26');
        const end = new Date('2023-03-02');
        const expected = [
            new Date('2023-02-26'),
            new Date('2023-02-27'),
            new Date('2023-02-28'),
            new Date('2023-03-01'),
            new Date('2023-03-02')
        ];
        expect(dateRange(begin, end)).toEqual(expected);
    })

    test("endDate comes before beginDate", () => {
        const begin = new Date('2023-03-05');
        const end = new Date('2023-03-02');
        const expected: Date[] = [];
        expect(dateRange(begin, end)).toEqual(expected);
    })
})
