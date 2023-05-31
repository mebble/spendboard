import { DataFrame } from "@grafana/data";
import { Expense, MyQuery } from "types";
import { hasTags, matchesName, notHaveTags } from "./filters";
import { depreciating, identity } from "./transforms";

export const queryData = (expenses: Expense[], query: MyQuery): DataFrame => {
    const filtered = expenses.filter(expense => {
        return hasTags(query, expense) &&
            notHaveTags(query, expense) &&
            matchesName(query, expense);
    })
    if (query.depreciating) {
        return depreciating(query, filtered);
    }
    return identity(query, filtered);
}
