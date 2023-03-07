/**
 * Validate object properties
 * @param request object
 * @param required keys needle in object
 * @example
 * checkRequired({key:"some key", date: "2022-01-01"}, ['key', 'date']) -> true
 * checkRequired({key:"some key", date: "2022-01-01"}, ['key']) -> true
 * checkRequired({key:"some key", date: "2022-01-01"}, ['key','date','list']) -> false
 * */
const checkRequired = (request, required) => {
    for (let item of required)
        if (request[item] === undefined)
            return false

    return true
}

/**
 * return object of cookies
 * @param cookieString cookie string
 * @example
 * cookieParser("locationId=1; token=some_token") ->
 * {
 *     locationId: "1",
 *     token: "some_token"
 * }
 * */
const cookieParser = (cookieString) => {
    let rx = /([^;=\s]*)=([^;]*)/g;
    let obj = { };
    for (let m; m = rx.exec(cookieString);)
        obj[m[1]] = decodeURIComponent(m[2]);
    return obj;
}

/**
 * Convert date to unix and return object
 * -> {start: (bigint), end: (bigint)}
 * @example
 * dateKey = {
 *     1: 'Сегодня',
 *     2: 'Вчера',
 *     3: 'Эта неделя',
 *     4: 'Прошлая неделя',
 *     5: 'Этот месяц',
 *     6: 'Прошлый месяц',
 *     7: 'Выбрать даты',
 *     default: {start:0, end:0}
 * }
 * @param dateKey key of example
 * @param start start date "2022-01-01"
 * @param end end date "2022-01-31"
 * */
const dateConverter = (dateKey, start, end) => {
    let d = new Date();
    let now = Date.now();
    switch (dateKey){
        case '1':  // Сегодня
            return {
                start: +new Date(d.toJSON().substr(0,10) + " 00:00:00"),
                end: +new Date(d.toJSON().substr(0,10) + " 23:59:59")
            }
        case '2':  // Вчера
            return {
                start: +new Date(new Date(now - 86400000).toJSON().substr(0,10) + " 00:00:00"),
                end: +new Date(new Date(now - 86400000).toJSON().substr(0,10) + " 23:59:59")
            }
        case '3':  // Эта неделя
            return {
                start: +new Date(new Date(now - +d.getDay() * 86400000 + 86400000).toJSON().substr(0,10) + " 00:00:00"),
                end: +new Date(new Date(now - +d.getDay() * 86400000 + 86400000).toJSON().substr(0,10) + " 00:00:00") + 86400000 * 7 - 1,
            }
        case '4':  // Прошлая неделя
            return {
                start: +new Date(new Date(now - +d.getDay() * 86400000 + 86400000).toJSON().substr(0,10) + " 00:00:00") - 86400000 * 7,
                end: +new Date(new Date(now - +d.getDay() * 86400000 + 86400000).toJSON().substr(0,10) + " 00:00:00") - 86399999,
            }
        case '5':  // Этот месяц
            return {
                start: +new Date(d.getFullYear(), d.getMonth(), 1),
                end: +new Date(d.getFullYear(), d.getMonth()+1, 0) + 86399999
            }
        case '6':  // Прошлый месяц
            return {
                start: +new Date(d.getFullYear(), d.getMonth() - 1, 1),
                end: +new Date(d.getFullYear(), d.getMonth(), 0) + 86399999
            }
        case '7':  // Выбрать даты
            if(!start || !end) return {
                start: 0,
                end: 0
            };
            return {
                start: +new Date(start + " 00:00:00"),
                end: +new Date(end + " 23:59:59")
            }
        default:
            return {
                start: 0,
                end: 0
            }
    }
}

/**
 * return unix timestamp from date
 * @example
 * dateToUnixTimestamp('2022-01-01') -> 1640995200
 * @param date human date like 2022-01-01
 * */
const dateToUnixTimestamp = (date) => Math.floor(+new Date(date) / 1000)

/**
 *  remove html specific symbols
 * @example
 * htmlEncode("<script>") -> '&lt;script&gt;'
 * */
const htmlEncode = (data) =>
    data.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\\/g, '&bsol;')
        .replaceAll("'",'&apos;')

/**
 * mask for phone number by sample: +X(XXX)XXX-XX-XX
 * @param phone number may be string or bigint
 * @param demask if true phone will be unmasked
 * @example
 * maskPhone(77071236699) -> "+7(707)123-66-99"
 * maskPhone("77071236699") -> "+7(707)123-66-99"
 * maskPhone("+7(707)123-66-99") -> "77071236699"
 * */
const maskPhone = function (phone, demask = false) {

    phone = phone.toString()

    if (demask) return phone.replace(/\D/g,'')

    let matrix = "+_(___)___-__-__",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = phone.replace(/\D/g, "");

    if (def.length >= val.length) val = def;

    phone = matrix.replace(/./g,(a) => /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a );

    return phone
}

/**
 * get date from mills
 * @param milliseconds unix timestamp
 * @param hoursOffset timezone hours offset
 * @example
 * timeConverter(1678188006882, 6) -> '2023-03-07 17:20:06'
 * timeConverter(1678188006882, 0) -> '2023-03-07 11:20:06'
 * */
const timeConverter = (milliseconds, hoursOffset = new Date().getTimezoneOffset() / -60) =>
    new Date(new Date(milliseconds).setHours(new Date().getHours() + hoursOffset))
        .toJSON().replace('T',' ').substr(0,19)


module.exports = {
    checkRequired,
    cookieParser,
    dateConverter,
    dateToUnixTimestamp,
    htmlEncode,
    maskPhone,
    timeConverter
}
