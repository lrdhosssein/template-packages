import jdate from 'jdate'
let jalaliDate = {
  g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
};

export const convertJalaliToGregorian = function (j_y, j_m, j_d) {
  j_y = parseInt(j_y);
  j_m = parseInt(j_m);
  j_d = parseInt(j_d);
  if (j_m < 1 || j_m > 12) return "invalid";
  if (j_d < 1 || j_d > 31) return "invalid";

  var jy = j_y - 979;
  var jm = j_m - 1;
  var jd = j_d - 1;

  var j_day_no =
    365 * jy + parseInt(jy / 33) * 8 + parseInt(((jy % 33) + 3) / 4);
  for (var i = 0; i < jm; ++i) j_day_no += jalaliDate.j_days_in_month[i];

  j_day_no += jd;

  var g_day_no = j_day_no + 79;

  var gy =
    1600 +
    400 *
    parseInt(
      g_day_no / 146097
    ); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
  g_day_no = g_day_no % 146097;

  var leap = true;
  if (g_day_no >= 36525) {
    /* 36525 = 365*100 + 100/4 */
    g_day_no--;
    gy +=
      100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
    g_day_no = g_day_no % 36524;

    if (g_day_no >= 365) g_day_no++;
    else leap = false;
  }

  gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;

    g_day_no--;
    gy += parseInt(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }

  for (
    var i = 0;
    g_day_no >= jalaliDate.g_days_in_month[i] + (i == 1 && leap);
    i++
  )
    g_day_no -= jalaliDate.g_days_in_month[i] + (i == 1 && leap);
  var gm = i + 1;
  var gd = g_day_no + 1;

  gm = gm < 10 ? "0" + gm : gm;
  gd = gd < 10 ? "0" + gd : gd;

  return [gy, gm, gd];
};


const getPersianDate = (date) => {
  let week = [
    "يكشنبه",
    "دوشنبه",
    "سه شنبه",
    "چهارشنبه",
    "پنج شنبه",
    "جمعه",
    "شنبه",
  ];

  let months = [
    "فروردين",
    "ارديبهشت",
    "خرداد",
    "تير",
    "مرداد",
    "شهريور",
    "مهر",
    "آبان",
    "آذر",
    "دي",
    "بهمن",
    "اسفند",
  ];
  let d = date.getDay();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getYear();
  year = window.navigator.userAgent.indexOf("MSIE") > 0 ? year : 1900 + year;
  if (year === 0) {
    year = 2000;
  }
  if (year < 100) {
    year += 1900;
  }
  let y = 1;
  for (let i = 0; i < 3000; i += 4) {
    if (year === i) {
      y = 2;
    }
  }
  for (let i = 1; i < 3000; i += 4) {
    if (year === i) {
      y = 3;
    }
  }
  if (y === 1) {
    year -= month < 3 || (month == 3 && day < 21) ? 622 : 621;
    switch (month) {
      case 1:
        if (day < 21) {
          month = 10;
          day += 10;
        } else {
          month = 11;
          day -= 20;
        }
        break;
      case 2:
        if (day < 20) {
          month = 11;
          day += 11;
        } else {
          month = 12;
          day -= 19;
        }
        break;
      case 3:
        if (day < 21) {
          month = 12;
          day += 9;
        } else {
          month = 1;
          day -= 20;
        }
        break;
      case 4:
        if (day < 21) {
          month = 1;
          day += 11;
        } else {
          month = 2;
          day -= 20;
        }
        break;
      case 5:
      case 6:
        if (day < 22) {
          month -= 3;
          day += 10;
        } else {
          month -= 2;
          day -= 21;
        }
        break;
      case 7:
      case 8:
      case 9:
        if (day < 23) {
          month -= 3;
          day += 9;
        } else {
          month -= 2;
          day -= 22;
        }
        break;
      case 10:
        if (day < 23) {
          month = 7;
          day += 8;
        } else {
          month = 8;
          day -= 22;
        }
        break;
      case 11:
      case 12:
        if (day < 22) {
          month -= 3;
          day += 9;
        } else {
          month -= 2;
          day -= 21;
        }
        break;
      default:
        break;
    }
  }
  if (y === 2) {
    year -= month < 3 || (month === 3 && day < 20) ? 622 : 621;
    switch (month) {
      case 1:
        if (day < 21) {
          month = 10;
          day += 10;
        } else {
          month = 11;
          day -= 20;
        }
        break;
      case 2:
        if (day < 20) {
          month = 11;
          day += 11;
        } else {
          month = 12;
          day -= 19;
        }
        break;
      case 3:
        if (day < 20) {
          month = 12;
          day += 10;
        } else {
          month = 1;
          day -= 19;
        }
        break;
      case 4:
        if (day < 20) {
          month = 1;
          day += 12;
        } else {
          month = 2;
          day -= 19;
        }
        break;
      case 5:
        if (day < 21) {
          month = 2;
          day += 11;
        } else {
          month = 3;
          day -= 20;
        }
        break;
      case 6:
        if (day < 21) {
          month = 3;
          day += 11;
        } else {
          month = 4;
          day -= 20;
        }
        break;
      case 7:
        if (day < 22) {
          month = 4;
          day += 10;
        } else {
          month = 5;
          day -= 21;
        }
        break;
      case 8:
        if (day < 22) {
          month = 5;
          day += 10;
        } else {
          month = 6;
          day -= 21;
        }
        break;
      case 9:
        if (day < 22) {
          month = 6;
          day += 10;
        } else {
          month = 7;
          day -= 21;
        }
        break;
      case 10:
        if (day < 22) {
          month = 7;
          day += 9;
        } else {
          month = 8;
          day -= 21;
        }
        break;
      case 11:
        if (day < 21) {
          month = 8;
          day += 10;
        } else {
          month = 9;
          day -= 20;
        }
        break;
      case 12:
        if (day < 21) {
          month = 9;
          day += 10;
        } else {
          month = 10;
          day -= 20;
        }
        break;
      default:
        break;
    }
  }
  if (y === 3) {
    year -= month < 3 || (month === 3 && day < 21) ? 622 : 621;
    switch (month) {
      case 1:
        if (day < 20) {
          month = 10;
          day += 11;
        } else {
          month = 11;
          day -= 19;
        }
        break;
      case 2:
        if (day < 19) {
          month = 11;
          day += 12;
        } else {
          month = 12;
          day -= 18;
        }
        break;
      case 3:
        if (day < 21) {
          month = 12;
          day += 10;
        } else {
          month = 1;
          day -= 20;
        }
        break;
      case 4:
        if (day < 21) {
          month = 1;
          day += 11;
        } else {
          month = 2;
          day -= 20;
        }
        break;
      case 5:
      case 6:
        if (day < 22) {
          month -= 3;
          day += 10;
        } else {
          month -= 2;
          day -= 21;
        }
        break;
      case 7:
      case 8:
      case 9:
        if (day < 23) {
          month -= 3;
          day += 9;
        } else {
          month -= 2;
          day -= 22;
        }
        break;
      case 10:
        if (day < 23) {
          month = 7;
          day += 8;
        } else {
          month = 8;
          day -= 22;
        }
        break;
      case 11:
      case 12:
        if (day < 22) {
          month -= 3;
          day += 9;
        } else {
          month -= 2;
          day -= 21;
        }
        break;
      default:
        break;
    }
  }
  return [week[d], day, months[month - 1], year];
};
export const dateToString = (input) => {

  let inputs = p2e(input).split("/");
  if (inputs.length !== 3) return false;
  let year = inputs[0].length > 2 ? inputs[0] : inputs[2];
  let month = inputs[1];
  let day = inputs[0].length > 2 ? inputs[2] : inputs[0];
  let convertedDate = convertJalaliToGregorian(year, month, day);
  if (convertedDate === "invalid") return "Invalid Date";
  return getPersianDate(new Date(convertedDate));
};
export const dateToStringWithNumericFormat = (input) => {

  let inputs = p2e(input).split("/");
  if (inputs.length !== 3) return false;
  let year = inputs[0].length > 2 ? inputs[0] : inputs[2];
  let month = inputs[1];
  let day = inputs[0].length > 2 ? inputs[2] : inputs[0];
  let convertedDate = convertJalaliToGregorian(year, month, day);
  if (convertedDate === "invalid") return "Invalid Date";
  return new Date(convertedDate);
};
export const getDateFromPerisanDate = (input) => {
  let inputs = p2e(input).split("/");
  if (inputs.length !== 3) return false;
  let year = inputs[0].length > 2 ? inputs[0] : inputs[2];
  let month = inputs[1];
  let day = inputs[0].length > 2 ? inputs[2] : inputs[0];
  let convertedDate = convertJalaliToGregorian(year, month, day);
  if (convertedDate === "invalid") return "Invalid Date";
  return new Date(convertedDate);
}
export const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
export const getDayDiff = (d1, d2) => {
  return Math.floor((d2.getTime() - d1.getTime()) / (24 * 3600 * 1000));
}

export const getTimeFromDate = (date) => {
  if (typeof date !== 'string' || date.split('/').length !== 3) return 0;
  const { toGregorian } = jdate.JDate.convert()
  let d1 = toGregorian(date.split('/'))
  return jdate.JDate(d1.join('/'))
}

export const getDiffFromDates = (date1, date2) => {
  if ((typeof date1 !== 'string') || date1.split('/').length !== 3)
    return 0;
  if (typeof date2 !== 'string' || date2.split('/').length !== 3)
    return 0;

  const { toGregorian } = jdate.JDate.convert()
  let d1 = toGregorian(date1.split('/'))
  let d2 = toGregorian(date2.split('/'))
  d1 = new Date(d1)
  d2 = new Date(d2)
  // d1 = jdate.JDate(d1.join('/'))
  // d2 = jdate.JDate(d2.join('/'))

  return Math.abs(d2.getTime() - d1.getTime());
}

export const paddingDate = (date) => {
  if (!date || date.split('/').length !== 3) return;
  return date.split('/').map(item => `${item}`.padStart(2, '0')).join('/')
}