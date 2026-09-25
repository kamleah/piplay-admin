import React from 'react';

interface WeekdayData {
    value: number;
    // You can add more properties if needed
}

const formatWeekdays = (data: WeekdayData[]): string => {
    // Extracting values from the data array
    const labels = data?.map(item => item.value);

    // Mapping each day to its corresponding abbreviation
    const abbreviations: Record<number, string> = {
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
        7: "Sun"
    };

    // Sorting the labels based on their corresponding values
    const sortedLabels = labels?.sort((a, b) => a - b);

    // Grouping consecutive days together
    let output: number[][] = [];
    let tempArr: number[] = [];
    for (let i = 0; i < sortedLabels?.length; i++) {
        if (tempArr.length === 0) {
            tempArr.push(sortedLabels[i]);
        } else {
            const current = tempArr[tempArr.length - 1];
            const next = sortedLabels[i];
            if (next - current === 1) {
                tempArr.push(sortedLabels[i]);
            } else {
                output.push(tempArr);
                tempArr = [sortedLabels[i]];
            }
        }
    }
    output.push(tempArr); // Push the remaining days

    // Merge consecutive single days into groups
    let tempOut: number[][] = [];
    output.forEach(group => {
        if (group.length > 2) {
            tempOut.push(group);
        } else {
            group.forEach(item => {
                tempOut.push([item]);
            })
        }
    });
    output = tempOut;

    // Formatting the output
    const formattedOutput = output.map(group => {
        if (group.length === 1) {
            return abbreviations[group[0]];
        } else {
            return `${abbreviations[group[0]]} - ${abbreviations[group[group.length - 1]]}`;
        }
    }).join(', ');
    return formattedOutput;
};

export default formatWeekdays;
