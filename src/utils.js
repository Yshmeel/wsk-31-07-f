const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const formatDate = (date) => {
    const exploded = date.split("-");

    return `${MONTHS[exploded[1]-1]} ${exploded[2]}, ${exploded[0]};`
};