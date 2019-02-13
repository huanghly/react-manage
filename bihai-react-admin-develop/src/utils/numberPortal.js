export default {
    scientificToNumber: function (num) {
        let numStr = num.toString()
        if (numStr.toString().indexOf('e') < 0) {
            return num
        }
        return num.toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
    },
    precisionNoFixed: function (num, precision) { //参数：数字，保留小数的个数，不四舍五入，只能是小数
        if (num.toString().indexOf('.') < 0) {
            if (Number(num) === 'Infinity') {
                return 0;
            } else {
                return Number(num)
            }
        } else {
            return Number(num.toString().substring(0, num.toString().indexOf('.') + precision + 1))
        }
    }
}