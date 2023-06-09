import { DataFrame, FieldType, MutableDataFrame } from "@grafana/data";
import { Expense, MyQuery } from "types";
import { hasTags, matchesName, notHaveTags } from "./filters";
import { ExpenseDepreciate, depreciating } from "./transforms";
import { getWeek } from "date-fns";
import { Month, Day, day, month } from "utils";

export const queryData = (expenses: Expense[], query: MyQuery): DataFrame => {
    const filtered = expenses.filter(expense => {
        return hasTags(query, expense) &&
            notHaveTags(query, expense) &&
            matchesName(query, expense);
    })

    if (query.depreciating) {
        const transformed = depreciating(filtered)
        return depreciatingDataFrame(query, transformed);
    } else {
        return identityDataFrame(query, expenses);
    }
}

function depreciatingDataFrame(query: MyQuery, expenses: ExpenseDepreciate[]): DataFrame {
    const frame = new MutableDataFrame<DataPointDepreciating>({
        refId: query.refId,
        fields: [
            ...baseFields,
            { name: costPerDayKey, type: FieldType.number }
        ],
    });
    for (const expense of expenses) {
        frame.add({
            RefId: query.refId,
            Date: expense.date.getTime(),
            Name: expense.name,
            Amount: expense.amount,
            Month: month(expense.date),
            MonthIndex: expense.date.getMonth(),
            'Day of week': day(expense.date),
            DayIndex: expense.date.getDay(),
            WeekIndex: getWeek(expense.date),
            Year: expense.date.getFullYear(),
            Tags: expense.tags,
            costPerDay: expense.costPerDay,
        });
    }
    return frame;
}

function identityDataFrame(query: MyQuery, expenses: Expense[]): DataFrame {
    const frame = new MutableDataFrame<DataPoint>({
        refId: query.refId,
        fields: baseFields
    });
    for (const expense of expenses) {
        frame.add({
            RefId: query.refId,
            Date: expense.date.getTime(),
            Name: expense.name,
            Amount: expense.amount,
            Month: month(expense.date),
            MonthIndex: expense.date.getMonth(),
            'Day of week': day(expense.date),
            DayIndex: expense.date.getDay(),
            WeekIndex: getWeek(expense.date),
            Year: expense.date.getFullYear(),
            Tags: expense.tags,
        });
    }
    return frame;
}

const RefIdKey = 'RefId'
const DateKey = 'Date'
const NameKey = 'Name'
const AmountKey = 'Amount'
const MonthKey = 'Month'
const MonthIndexKey = 'MonthIndex'
const DayKey = 'Day of week'
const DayIndexKey = 'DayIndex'
const WeekIndexKey = 'WeekIndex'
const YearKey = 'Year'
const TagsKey = 'Tags'
const costPerDayKey = 'costPerDay'

const baseFields = [
    { name: RefIdKey, type: FieldType.string },
    { name: DateKey, type: FieldType.time },
    { name: NameKey, type: FieldType.string },
    { name: AmountKey, type: FieldType.number },
    { name: MonthKey, type: FieldType.string },
    { name: MonthIndexKey, type: FieldType.number },
    { name: DayKey, type: FieldType.string },
    { name: DayIndexKey, type: FieldType.number },
    { name: WeekIndexKey, type: FieldType.number },
    { name: YearKey, type: FieldType.number },
    { name: TagsKey, type: FieldType.other },
];

type DataPoint = {
    [RefIdKey]: string;
    [DateKey]: number;
    [NameKey]: string;
    [AmountKey]: number;
    [MonthKey]: Month;
    [DayKey]: Day;
    [YearKey]: number;
    [MonthIndexKey]: number;
    [DayIndexKey]: number;
    [WeekIndexKey]: number;
    [TagsKey]: string[];
}

type DataPointDepreciating = DataPoint & {
    [costPerDayKey]: number;
}
