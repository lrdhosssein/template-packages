import { splitChar, strings } from "../constants";
import { baseUrl } from "../constants/Config";
import { audioTypes, documentTypes, excelTypes, imageTypes, videoTypes } from "../constants/fileTypes";
import { dynamicApi } from "../services/api";
import toLangDigits from "./toLangDigits";
import jdate from 'jdate'
import { v4 as uuidv4 } from "uuid";

export const generateCode = (length) => {
    var a = "1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
};

export function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const makeData = (getData) => {
    let modifiedBanks = [];
    getData.forEach((group) => {
        modifiedBanks.push({
            id: group.key,
            parent: 0,
            text: group.label,
            droppable: true,
            opened: group.opened,
            created: true,
            // selected: false,
            // prevOpen: false
        });
        group.children.forEach((bank) => {
            modifiedBanks.push({
                id: bank.key,
                parent: group.key,
                code: bank.code,
                text: bank.label,
                data: { fileType: "database" },
                created: true,
                // selected: false,
                // prevOpen: false
            });
        });
    });
    return modifiedBanks;
};

export const iconPath = (name) => {
    return `${baseUrl}uploads/icons/default/${name}.svg`;
};

export const getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    context.font = font || getComputedStyle(document.body).font;

    return context.measureText(text).width;
}

export const getDiffrenceDate = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const isInViewPort = (element, container) => {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    let out = {};
    out.vertical = ((elementRect.top + elementRect.height) < (containerRect.height + containerRect.top)) && (elementRect.top > containerRect.top);
    out.horizontal = ((elementRect.left + elementRect.width) < (containerRect.left + containerRect.width)) && (elementRect.left > containerRect.left);
    return out;
}

export const customSort = (item1, item2, prop) => {
    const a = item1[prop], b = item2[prop]
    return `${a}`.localeCompare(`${b}`)
}

export const addCommas = (num) => {
    if (num === undefined || num === null) return ''
    return toLangDigits(`${num}`.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

export const removeNonNumeric = (num) => num.toString().replace(/[^0-9.-]/g, "");
export const removeAllSpaceAndEnter = (text) => {
    const chars = {
        '\n': '', '\r': "", ' ': ""
    };
    let convertedChar = Object.keys(chars).map(i => `${'\\'}${i}`).join('')
    text = `${text}`
        .replace(new RegExp(`[${convertedChar}]`, 'g'), m => chars[m])
    return text;
}

export const detectFileType = (input) => {
    let type = 'other'
    if (imageTypes.findIndex(item => `${item}`.toLocaleLowerCase().trim() === `${input}`.toLocaleLowerCase().trim()) > -1)
        type = 'image'
    else if (excelTypes.findIndex(item => `${item}`.toLocaleLowerCase().trim() === `${input}`.toLocaleLowerCase().trim()) > -1)
        type = 'excel'
    else if (documentTypes.findIndex(item => `${item}`.toLocaleLowerCase().trim() === `${input}`.toLocaleLowerCase().trim()) > -1)
        type = 'word'
    else if (audioTypes.findIndex(item => `${item}`.toLocaleLowerCase().trim() === `${input}`.toLocaleLowerCase().trim()) > -1)
        type = 'audio'
    else if (videoTypes.findIndex(item => `${item}`.toLocaleLowerCase().trim() === `${input}`.toLocaleLowerCase().trim()) > -1)
        type = 'video'
    else if (input === 'txt')
        type = 'text'
    else if (input === 'pdf')
        type = 'pdf'
    return type
}

export const sortStrings = (list, prop) => {
    return list.sort(function (a, b) {
        return `${a[prop]}`.localeCompare(b[prop])
    })

}

export function detectSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

export function generateUniqueId() {
    return uuidv4().replace(new RegExp("-", "gi"), "")
}

export const userEntryLog = (type, token) => {
    dynamicApi('post', 'user_entry_log', { loginType: type }, token)
}

export const detectColor = (type = '',) => {
    if (!type) return "var(--shadow)";
    if (type.includes('ثبت'))
        return "rgb(152, 216, 170)";
    else if (type.includes('ویرایش'))
        return "rgb(197, 223, 248)"
    else if (type.includes('حذف'))
        return "rgb(252, 174, 174)"
    else if (type.includes('عملیات'))
        return "rgb(243, 233, 159)"
    else if (type.includes('ماژول') || type.includes('تسلسل'))
        return "rgb(228, 209, 185)"
    return "var(--shadow)";
}

export const isExist = (item) => {
    return item !== null && item !== undefined && item !== ""
}

export const converStringTimeAndDate2DateType = (date, time) => {
    //date = 1399/02/01 time=23:52:21
    if (!date || !time) return;
    const { toGregorian } = jdate.JDate.convert()
    let d = toGregorian(date.split('/')).map(item => `${item}`.padStart(2, 0)).join('-')
    d = new Date(`${d}T${time}Z`)
    d.setMinutes(d.getMinutes() - 210);
    return d
}

export const isRealValue = (obj) => {
    return (
        obj &&
        obj !== "null" &&
        obj !== "undefined" &&
        Object.keys(obj).length !== 0
    );
};

export const fetchPopupKey = (rel) => {
    let key = 'position_name'
    switch (rel) {
        case 'userpos':
            key = 'position_name'
            break;
        case 'username':
            key = 'username'
            break;
        case 'usernamefamily':
            key = 'name_family'
            break;
        case 'userphone':
            key = 'phone'
            break;
        default:
            key = 'position_name'
            break;
    }
    return key
}

export const countProperties = (obj) => {
    var count = 0;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) ++count;
    }
    return count;
};

export const secondsDiff = (dateTimeValue2, dateTimeValue1) => {
    let differenceValue = (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
    // differenceValue /= 60;
    return Math.abs(Math.round(differenceValue));
}

export const editValueByType = (value, type) => {
    let editedValue = type === strings.number ? addCommas(value) : toLangDigits(value);
    if (type === strings.multiSelect)
        editedValue = editedValue.split(splitChar).join(', ');
    return editedValue;
}