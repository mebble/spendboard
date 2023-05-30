import { fromPartial } from "@total-typescript/shoehorn"
import { hasTags, notHaveTags } from "./filters"

describe('hasTags', () => {
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
