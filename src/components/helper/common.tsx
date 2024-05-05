import React from 'react'

export function validateWords(value: string, max_length: number) {
    if (value.split(' ').length <= max_length) {
        return null;
    }
    return "You have reached the maximum word limit"
}

export const getFlatKeys = (o: any, prefix = ''): string[] => {
    return Object.keys(o).flatMap(k => {
        const dot = prefix ? '.' : '';
        const new_k = isNaN(+k) ? `${dot}${k}` : `[${k}]`;
        const new_prefix = `${prefix}${new_k}`;
        return Object(o[k]) === o[k] ? getFlatKeys(o[k], new_prefix) : [new_prefix]
    });
}

export function getNestedValue(original_data: any, original_key: string, default_value: any = "-") {
    const keys = original_key.split('.');
    let data = {...original_data};
    keys.forEach(key => {
        data = data ? data[key] : default_value;
    });
    return data;
}

export function getStatus(status: string) {
    if (status === "new") {
        return "Needs Attention"
    } else {
        return status.toUpperCase()
    }
}

export function getStatusColor(status: string) {
    if (status === "new") {
        return "#dc3545"
    }
    if (status === "done") {
        return "green"
    } else if (status === "on going") {
        return "green"
    } else {
        return "grey"
    }
}
