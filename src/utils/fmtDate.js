
export function fmtDate(d, t, tz) {
    if (!d && !t) return null;
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONS = [
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
    ];

    if (d) {
        const [y, m, day] = d.split('-').map(Number);
        const dt = new Date(y, m - 1, day);
        let s = `${DAYS[dt.getDay()]}, ${MONS[dt.getMonth()]} ${day}`;
        if (t) {
            const [h, mi] = t.split(':').map(Number);
            s += ` • ${h % 12 || 12}:${String(mi).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'} ${tz}`;
        }
        return s;
    }
    const [h, mi] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(mi).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'} ${tz}`;
}
