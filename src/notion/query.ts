import { DataQueryResponseData, FieldType, MutableDataFrame } from "@grafana/data";
import { getWeek } from 'date-fns';
import { Expense, MyQuery } from "types";
import { Month, Day, isSuperset, month, day } from "utils";

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

type DataPoint = {
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

export const queryData = (expenses: Expense[], query: MyQuery): DataQueryResponseData => {
    const frame = new MutableDataFrame<DataPoint>({
        refId: query.refId,
        fields: [
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
        ],
    });
    for (const expense of expenses) {
        if (isSuperset(new Set(expense.tags), new Set(query.tags))) {
            frame.add({
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
    }
    return frame;
}
