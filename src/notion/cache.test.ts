import { mock, instance, when, anything, verify } from '@typestrong/ts-mockito';
import { RangeCache } from "./cache"
import { INotion } from "./types"

describe('range cache: getExpensesBetween', () => {
    let notion: INotion;

    beforeEach(() => {
        notion = mock();
        when(notion.getExpensesBetween(anything(), anything()))
            .thenResolve({ success: true, data: anything() })
    });

    test('cache miss: no overlap', async () => {
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

    test('cache miss: with overlap', async () => {
        const cache = new RangeCache(instance(notion));

        const d1 = new Date('2023-01-01'); 
        const d2 = new Date('2023-01-10');
        const d3 = new Date('2023-01-05');
        const d4 = new Date('2023-01-15');

        await cache.getExpensesBetween(d1, d2);
        verify(notion.getExpensesBetween(anything(), anything())).once();

        await cache.getExpensesBetween(d3, d4); 
        verify(notion.getExpensesBetween(anything(), anything())).twice();
    })

    test('cache hit: same set', async () => {
        const cache = new RangeCache(instance(notion));

        const d1 = new Date('2023-01-01'); 
        const d2 = new Date('2023-01-10');

        await cache.getExpensesBetween(d1, d2);
        verify(notion.getExpensesBetween(anything(), anything())).once();

        await cache.getExpensesBetween(d1, d2); 
        verify(notion.getExpensesBetween(anything(), anything())).once();
    })

    test('cache hit: subset', async () => {
        const cache = new RangeCache(instance(notion)); 

        const d1 = new Date('2023-01-01'); 
        const d2 = new Date('2023-01-10');
        const d3 = new Date('2023-01-02');
        const d4 = new Date('2023-01-09');

        await cache.getExpensesBetween(d1, d2);
        verify(notion.getExpensesBetween(anything(), anything())).once();

        await cache.getExpensesBetween(d3, d4); 
        verify(notion.getExpensesBetween(anything(), anything())).once();
    });
})
