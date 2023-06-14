import { mock, instance, when, anything, verify } from '@typestrong/ts-mockito';
import { fromPartial } from '@total-typescript/shoehorn';

import { RangeCache } from "./cache"
import { INotion, NotionError } from "./types"
import { Expense, Result } from 'types';

describe('range cache: getExpensesBetween', () => {
    let notion: INotion;

    describe('cache miss', () => {
        beforeEach(() => {
            notion = mock();
            when(notion.getExpensesBetween(anything(), anything()))
                .thenResolve({ success: true, data: [] })
        });

        test('no overlap', async () => {
            const cache = new RangeCache(instance(notion));

            const d1 = new Date('2023-01-01'); 
            const d2 = new Date('2023-01-10');
            const d3 = new Date('2023-01-11');
            const d4 = new Date('2023-01-20');

            await cache.getExpensesBetween(d1, d2);
            verify(notion.getExpensesBetween(anything(), anything())).once();

            await cache.getExpensesBetween(d3, d4); 
            verify(notion.getExpensesBetween(anything(), anything())).twice();
        })

        test('with overlap', async () => {
            const cache = new RangeCache(instance(notion));

            const d1 = new Date('2023-01-01'); 
            const d2 = new Date('2023-01-05');
            const d3 = new Date('2023-01-10');
            const d4 = new Date('2023-01-15');

            await cache.getExpensesBetween(d1, d3);
            verify(notion.getExpensesBetween(anything(), anything())).once();

            await cache.getExpensesBetween(d2, d4); 
            verify(notion.getExpensesBetween(anything(), anything())).twice();
        })

    })

    describe('cache hit after overlap', () => {
        beforeEach(() => {
            notion = mock();
        });

        test('single overlap merge: should cache hit', async () => {
            const d1 = new Date('2023-01-01'); 
            const da = new Date('2023-01-03'); 
            const d2 = new Date('2023-01-05');
            const db = new Date('2023-01-07'); 
            const d3 = new Date('2023-01-10');
            const dc = new Date('2023-01-12'); 
            const d4 = new Date('2023-01-15');

            const res1: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: d1 }),
                    fromPartial({ date: da }),
                    fromPartial({ date: d2 }),
                    fromPartial({ date: db }),
                    fromPartial({ date: d3 }),
                ]
            };
            const res2: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: d2 }),
                    fromPartial({ date: db }),
                    fromPartial({ date: d3 }),
                    fromPartial({ date: dc }),
                    fromPartial({ date: d4 }),
                ]
            }
            const expected: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: da }),
                    fromPartial({ date: d2 }),
                    fromPartial({ date: db }),
                    fromPartial({ date: d3 }),
                    fromPartial({ date: dc }),
                ]
            }

            when(notion.getExpensesBetween(d1, d3))
                .thenResolve(res1)
            when(notion.getExpensesBetween(d2, d4))
                .thenResolve(res2)

            const cache = new RangeCache(instance(notion));
 
            await cache.getExpensesBetween(d1, d3);
            verify(notion.getExpensesBetween(anything(), anything())).once();

            await cache.getExpensesBetween(d2, d4); 
            verify(notion.getExpensesBetween(anything(), anything())).twice();

            // this date range should not be a subset of any of the previously queried date ranges
            const actual = await cache.getExpensesBetween(da, dc);
            verify(notion.getExpensesBetween(anything(), anything())).twice();
            expect(actual).toEqual(expected);
        })

        test('multiple overlap merge: should cache hit', async () => {
            const d1 = new Date('2023-01-01'); 
            const da = new Date('2023-01-03'); 
            const d2 = new Date('2023-01-05');
            const db = new Date('2023-01-07'); 
            const d3 = new Date('2023-01-10');
            const dc = new Date('2023-01-11'); 
            const d4 = new Date('2023-01-15');

            const res1: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: d1 }),
                    fromPartial({ date: da }),
                    fromPartial({ date: d2 }),
                ]
            };
            const res2: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: d3 }),
                    fromPartial({ date: dc }),
                    fromPartial({ date: d4 }),
                ]
            }
            const res3: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: d2 }),
                    fromPartial({ date: db }),
                    fromPartial({ date: d3 }),
                ]
            }
            const expected: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: da }),
                    fromPartial({ date: d2 }),
                    fromPartial({ date: db }),
                    fromPartial({ date: d3 }),
                    fromPartial({ date: dc }),
                ]
            }

            when(notion.getExpensesBetween(d1, d2))
                .thenResolve(res1)
            when(notion.getExpensesBetween(d3, d4))
                .thenResolve(res2)
            when(notion.getExpensesBetween(d2, d3))
                .thenResolve(res3)

            const cache = new RangeCache(instance(notion));
 
            await cache.getExpensesBetween(d1, d2);
            verify(notion.getExpensesBetween(anything(), anything())).once();
            await cache.getExpensesBetween(d3, d4); 
            verify(notion.getExpensesBetween(anything(), anything())).twice();
            await cache.getExpensesBetween(d2, d3); 
            verify(notion.getExpensesBetween(anything(), anything())).thrice();

            // this date range should not be a subset of any of the previously queried date ranges
            const actual = await cache.getExpensesBetween(da, dc);
            verify(notion.getExpensesBetween(anything(), anything())).thrice();
            expect(actual).toEqual(expected);
        })
    })

    describe('cache hit', () => {
        beforeEach(() => {
            notion = mock();
        });

        test('same set', async () => {
            const d1 = new Date('2023-01-01'); 
            const d2 = new Date('2023-01-02');
            const d3 = new Date('2023-01-09');
            const d4 = new Date('2023-01-10');
            const expected: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: d1 }),
                    fromPartial({ date: d2 }),
                    fromPartial({ date: d3 }),
                    fromPartial({ date: d4 }),
                ]
            };
            when(notion.getExpensesBetween(anything(), anything()))
                .thenResolve(expected)

            const cache = new RangeCache(instance(notion));

            const actual1 = await cache.getExpensesBetween(d1, d4);
            verify(notion.getExpensesBetween(anything(), anything())).once();
            expect(actual1).toEqual(expected);

            const actual2 = await cache.getExpensesBetween(d1, d4); 
            verify(notion.getExpensesBetween(anything(), anything())).once();
            expect(actual2).toEqual(expected);
        })

        test('subset', async () => {
            const d1 = new Date('2023-01-01'); 
            const d2 = new Date('2023-01-02');
            const d3 = new Date('2023-01-04');
            const d4 = new Date('2023-01-07');
            const d5 = new Date('2023-01-09');
            const d6 = new Date('2023-01-10');
            const expected1: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: d1 }),
                    fromPartial({ date: d2 }),
                    fromPartial({ date: d3 }),
                    fromPartial({ date: d4 }),
                    fromPartial({ date: d5 }),
                    fromPartial({ date: d6 }),
                ]
            };
            const expected2: Result<Expense[], NotionError> = {
                success: true,
                data: [
                    fromPartial({ date: d2 }),
                    fromPartial({ date: d3 }),
                    fromPartial({ date: d4 }),
                    fromPartial({ date: d5 }),
                ]
            }
            when(notion.getExpensesBetween(anything(), anything()))
                .thenResolve(expected1)

            const cache = new RangeCache(instance(notion)); 

            const actual1 = await cache.getExpensesBetween(d1, d6);
            verify(notion.getExpensesBetween(anything(), anything())).once();
            expect(actual1).toEqual(expected1);

            const actual2 = await cache.getExpensesBetween(d2, d5); 
            verify(notion.getExpensesBetween(anything(), anything())).once();
            expect(actual2).toEqual(expected2);
        });
    })
})
