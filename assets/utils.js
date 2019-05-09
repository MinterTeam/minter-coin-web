import format from 'date-fns/esm/format';
import prettyNum from 'pretty-num';
import decode from 'entity-decode';
import {EXPLORER_WEB_HOST} from "~/assets/variables";

export function getTime(timestamp) {
    const time = format(new Date(Number(timestamp)), 'dd-MMM-yyyy HH:mm');

    return time && time !== 'Invalid Date' ? time : false;
}

export function pretty(value) {
    return decode(prettyNum(value, {precision: 4, rounding: 'significant', thousandsSeparator: '&thinsp;'}));
}
export function prettyUsd(value) {
    return decode(prettyNum(value, {precision: 2, thousandsSeparator: '&thinsp;'}));
}
export function prettyRound(value) {
    return decode(prettyNum(value, {precision: 0, thousandsSeparator: '&thinsp;'}));
}

export function getExplorerAddressUrl(address) {
    return EXPLORER_WEB_HOST + '/address/' + address;
}

// export function pretty(value) {
//     return decode(prettyNum(value, {precision: 4, rounding: 'significant', thousandsSeparator: '&thinsp;'}));
// }
// export function prettyUsd(value) {
//     return decode(prettyNum(value, {precision: 2, thousandsSeparator: '&thinsp;'}));
// }
// export function prettyRound(value) {
//     return decode(prettyNum(value, {precision: 0, thousandsSeparator: '&thinsp;'}));
// }
//
// export function shortFilter(value, endLength = 6, minLengthToShort) {
//     const startLength = endLength + 'Mx'.length - 1;
//     minLengthToShort = minLengthToShort || startLength + endLength;
//     value = value.toString();
//     const isLong = value.length > minLengthToShort;
//
//     return isLong ? value.substr(0, startLength) + '…' + value.substr(-endLength) : value;
// }
//
// /**
//  * Ensure that string us url, otherwise make it url
//  * @param {string} url
//  */
// export function ensureUrl(url) {
//     if (typeof url !== 'string') {
//         return url;
//     }
//
//     url = url.trim();
//     if (url.search(/https?:\/\//) !== 0) {
//         url = 'http://' + url;
//     }
//
//     return url;
// }
//
// export function prettyUrl(url) {
//     if (typeof url !== 'string') {
//         return url;
//     }
//
//     url = url.trim();
//     return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
// }

export function pluralFormEn(value, form1, form2) {
    if (parseInt(value, 10) === 1) {
        return form1;
    } else {
        return form2;
    }
}

export function pluralFormRu(value, form1, form2, form3) {
    value = value % 100; // интереусует последние 2 цифры, т.к. 311 => form3
    let lastDigit = parseInt(value.toString().substr(-1, 1), 10);

    if (!form3) {
        form3 = form2;
    }

    if (value >= 11 && value <= 19) {
        return form3; // 11 атласов
    } else if (lastDigit === 1) {
        return form1; // 1 атлас
    } else if (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) {
        return form2; // 2 атласа
    } else {
        return form3; // 30 атласов
    }
}
