import { Range } from 'immutable'
import { isBefore, addDays } from 'date-fns'

export function dateRange(beginDate: Date, endDate: Date): Date[] {
    if (isBefore(endDate, beginDate)) {
        return []
    }

    return Range()
        .map(i => addDays(beginDate, i))
        .takeWhile(day => isBefore(day, endDate))
        .toArray()
}

export function startOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0)
    return newDate;
}

export function endOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setUTCHours(23, 59, 59, 999)
    return newDate;
}

export type Day = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

export function month(date: Date): Month {
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

export function day(date: Date): Day {
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

export function isSuperset<T>(set: Set<T>, subset: Set<T>): boolean {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

export async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

