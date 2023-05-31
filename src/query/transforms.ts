import { DataFrame, FieldType, MutableDataFrame } from "@grafana/data";
import { getWeek } from 'date-fns';
import { Seq } from 'immutable'
import { Month, Day, month, day, dateRange } from "utils";
import { Expense, MyQuery } from "types";

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
type ExpenseTransform = (query: MyQuery, expenses: Expense[]) => DataFrame;

export const identity: ExpenseTransform = (query, expenses) => {
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
    return frame;
}

const costPerDayKey = 'costPerDay'
type DataPointDepreciating = DataPoint & {
    [costPerDayKey]: number;
}

export const depreciating: ExpenseTransform = (query, expenses) => {
    const frame = new MutableDataFrame<DataPointDepreciating>({
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
            { name: costPerDayKey, type: FieldType.number }
        ],
    });

    const seq = Seq(expenses)
    const rest = seq.rest()
    seq.zip<Expense>(rest)
        .forEach(([expense, nextExpense]) => {
            const numDays = dateRange(expense.date, nextExpense.date).length;
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
                costPerDay: expense.amount / numDays,
            });
        })
    return frame;
}
