import { DataQueryResponseData, FieldType, MutableDataFrame } from "@grafana/data";
import { Expense, MyQuery } from "types";

const DateKey = 'Date'
const NameKey = 'Name'
const AmountKey = 'Amount'
const MonthKey = 'Month'
const MonthIndexKey = 'MonthIndex'
const DayKey = 'Day of week'
const DayIndexKey = 'DayIndex'
const TagsKey = 'Tags'

type DataPoint = {
    [DateKey]: number;
    [NameKey]: string;
    [AmountKey]: number;
    [MonthKey]: Month;
    [MonthIndexKey]: number;
    [DayKey]: Day;
    [DayIndexKey]: number;
    [TagsKey]: string[];
}

type Day = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

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
                Tags: expense.tags,
            });
        }
    }
    return frame;
}

function month(date: Date): Month {
    const monthIndex = date.getMonth();
    const months: Month[] = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    return months[monthIndex];
}

function day(date: Date): Day {
    const dayIndex = date.getDay();
    const days: Day[] = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
    ]
    return days[dayIndex];
}

function isSuperset<T>(set: Set<T>, subset: Set<T>): boolean {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}
