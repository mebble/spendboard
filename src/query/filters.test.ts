import { fromPartial } from "@total-typescript/shoehorn"
import { hasTags, matchesName, notHaveTags } from "./filters"

describe('hasTags', () => {
    test('query tags empty', () => {
        const predicate = hasTags(
            fromPartial({ tags: []}),
            fromPartial({ tags: ['a', 'c', 'b'] }),
        )
        expect(predicate).toBe(true)
    })

    test('has all query tags', () => {
        const predicate = hasTags(
            fromPartial({ tags: ['a', 'b']}),
            fromPartial({ tags: ['a', 'c', 'b'] }),
        )
        expect(predicate).toBe(true)
    })

    test('does not have all query tags', () => {
        const predicate = hasTags(
            fromPartial({ tags: ['a', 'b']}),
            fromPartial({ tags: ['a'] }),
        )
        expect(predicate).toBe(false)
    })
})

describe('notHaveTags', () => {
    test('query tags empty', () => {
        const predicate = hasTags(
            fromPartial({ notTags: []}),
            fromPartial({ tags: ['a', 'c', 'b'] }),
        )
        expect(predicate).toBe(true)
    })

    test('does not have query tags', () => {
        const predicate = notHaveTags(
            fromPartial({ notTags: ['a', 'b'] }),
            fromPartial({ tags: ['x', 'y'] }),
        )
        expect(predicate).toBe(true)
    })

    test('has some query tags', () => {
        const predicate = notHaveTags(
            fromPartial({ notTags: ['a', 'b', 'x'] }),
            fromPartial({ tags: ['x', 'y'] }),
        )
        expect(predicate).toBe(false)
    })
})

describe('matchesName', () => {
    test('query name is empty', () => {
        const predicate = matchesName(
            fromPartial({ name: '' }),
            fromPartial({ name: 'abc' }),
        )
        expect(predicate).toBe(true)
    })

    test('matches different case', () => {
        const predicate1 = matchesName(
            fromPartial({ name: 'abc' }),
            fromPartial({ name: 'ABC' }),
        )
        expect(predicate1).toBe(true)
        const predicate2 = matchesName(
            fromPartial({ name: 'ABC' }),
            fromPartial({ name: 'abc' }),
        )
        expect(predicate2).toBe(true)
    })

    test('matches superstring', () => {
        const predicate = matchesName(
            fromPartial({ name: 'abc' }),
            fromPartial({ name: 'xyz abc def' }),
        )
        expect(predicate).toBe(true)
    })

    test('does not match substring', () => {
        const predicate = matchesName(
            fromPartial({ name: 'abc def' }),
            fromPartial({ name: 'def' }),
        )
        expect(predicate).toBe(false)
    })
})
