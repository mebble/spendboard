export function startOfDay(date: Date): Date {
    date.setUTCHours(0, 0, 0, 0)
    return date;
}

export function endOfDay(date: Date): Date {
    date.setUTCHours(23, 59, 59, 999)
    return date;
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
