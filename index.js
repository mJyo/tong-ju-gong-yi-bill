// import testdata from './testdata.js'
import on20230723 from './20230723.js'
import on20230730 from './20230730.js'
import on20230806 from './20230806.js'
import on20230813 from './20230813.js'
const { createApp } = Vue

createApp({
    data() {
        return {
            datas: {
                // testdata,
                on20230723,
                on20230730,
                on20230806,
                on20230813
            },
            selectDate: null,
            showStatistics: false,
            tab: 0
        }
    },
    watch: {
        selectDate: {
            handler(n) {
                localStorage.setItem('selectDate', n)
                if (window.location.search != "") {
                    // see : https://stackoverflow.com/questions/10970078/modifying-a-query-string-without-reloading-the-page
                    let newurl = (function () {
                        let { protocol, host, pathname } = window.location
                        return `${protocol}//${host}${pathname}`
                    })()
                    window.history.pushState({ path: newurl }, '', newurl);
                }
            },
        },
        showStatistics: {
            handler(n) {
                localStorage.setItem('showStatistics', `${n}`)
            },
        }
    },
    mounted() {
        let { datas } = this;
        (() => {
            let date;
            const urlParams = new URLSearchParams(window.location.search);
            date = urlParams.get('selectDate')
            if (date && datas[date]) {
                this.selectDate = date
                return
            }
            date = localStorage.getItem('selectDate')
            if (date) {
                this.selectDate = date
                return
            }
            let dates = Object.keys(this.datas)
            this.selectDate = dates[dates.length - 1]
        })();
        (() => {
            this.showStatistics = localStorage.getItem('showStatistics') == "true"
        })();
        // define properties for 东西
        (function () {
            for (let date in datas) {
                let { 买 } = datas[date]
                for (let buy of 买) {
                    let { 人, 东西 } = buy
                    东西.forEach((it) => {
                        let { 啥, 总价, 消耗, 分摊, 私分, 未完待续, 使用情况 } = it
                        function isNull(o) {
                            return o == null || o == undefined
                        }
                        function err(msg) {
                            throw Error(msg + ": " + JSON.stringify({ it, 买, date }))
                        }

                        if (!isNull(消耗) && !isNull(分摊) && !isNull(私分) && 消耗 != 分摊 + 私分) {
                            err("消耗需要等于分摊+私分。然而对不上")
                        }
                        if (isNull(消耗) && isNull(分摊)) {
                            err("消耗 和 分摊 至少要填一个")
                        }
                        Object.defineProperty(it, 'date', {
                            get() {
                                return date
                            }
                        })
                        Object.defineProperty(it, '人', {
                            get() {
                                return 人
                            }
                        })
                        Object.defineProperty(it, '总价', {
                            get() {
                                return 总价 ? 总价 : 0
                            }
                        })
                        Object.defineProperty(it, '私分', {
                            get() {
                                if (私分) {
                                    return 私分
                                }
                                if (!isNull(消耗) && !isNull(分摊)) {
                                    return 消耗 - 分摊
                                }
                                return 0
                            }
                        })
                        Object.defineProperty(it, '分摊', {
                            get() {
                                return !isNull(分摊) ? 分摊 : (消耗 - it.私分)
                            }
                        })
                        Object.defineProperty(it, '消耗', {
                            get() {
                                return !isNull(消耗) ? 消耗 : (分摊 + it.私分)
                            }
                        })
                    })
                }
            }
        })()
    },
    computed: {
        link() {
            let { selectDate } = this
            let { protocol, host, pathname } = window.location
            return `${protocol}//${host}${pathname}?selectDate=${selectDate}`
        },
        此次() {
            let { datas, selectDate } = this
            return datas[selectDate]
        },
        buys() {
            return this.此次.买.flatMap(it => it.东西)
        },
        分摊总额() {
            let { 总消耗, 总私分 } = this
            return 总消耗 - 总私分
        },
        总消耗() {
            let { buys } = this
            return buys.map(({ 消耗 }) => 消耗).reduce((s, cur, idx, arr) => s + cur)
        },
        总私分() {
            let { buys } = this
            return buys.map(({ 私分 }) => 私分).reduce((s, cur, idx, arr) => s + cur)
        },
        平摊除数() {
            let { 此次, 分摊份额 } = this
            let { 做 } = 此次
            let r = 0
            做.forEach(it => {
                r += 分摊份额(it)
            })
            return r
        },
        参加者() {
            let { 此次, 平摊除数, 分摊份额, 分摊总额 } = this
            let { 做 } = 此次
            let r = []
            做.forEach((it) => {
                let 分摊数额 = 分摊总额 / 平摊除数 * 分摊份额(it);
                r.push({ ...it, 分摊数额 })
            })
            return r
        },
        所有人() {
            let { 参加者, 此次 } = this
            let { 买 } = 此次
            let 参加者人名 = 参加者.map(({ 人 }) => 人)
            return [
                ...参加者,
                ...(
                    买.map(({ 人 }) => {
                        return {
                            人,
                            人没来: true,
                            分摊数额: 0
                        }
                    }).filter(({ 人 }) => !参加者人名.includes(人))
                )
            ].map(item => {
                let itemOf买 = 买.find((it) => it.人 == item.人)
                if (!itemOf买) {
                    return { ...item, 其所购消耗: 0, 交钱: item.分摊数额 }
                } else {
                    let { 东西 } = itemOf买
                    let 其所购消耗
                    if (!东西 || 东西.length == 0) {
                        其所购消耗 = 0
                    } else {
                        其所购消耗 = 东西.map(({ 消耗 }) => 消耗).reduce((s, cur) => s + cur)
                    }

                    其所购消耗 = 其所购消耗 ? 其所购消耗 : 0
                    let 交钱 = item.分摊数额 - 其所购消耗
                    return { ...item, 其所购消耗, 交钱 }
                }
            })
        },
        未用完的物品() {
            let { datas } = this
            let res = Object.values(datas).flatMap(it => it.买).flatMap(it => it.东西).filter(({ 未完待续 }) => 未完待续 != null && 未完待续 != undefined)
            for (let idx in res) {
                let item = res[idx]
                let { 啥, 总价, 人, 去重id, 未完待续 } = item
                if (未完待续 == true) {
                    continue
                } else if (未完待续 == '已用完') {
                    let 公用花费总额 = 0
                    let prevs = res.slice(0, idx).filter(it => {
                        return it.啥 == 啥 && it.总价 == 总价 && it.人 == 人 && it.去重id == 去重id
                    })
                    for (let i in prevs) {
                        let it = prevs[i]
                        it["已用完"] = true
                        公用花费总额 += it.分摊
                    }
                    item["已用完"] = true
                    公用花费总额 += item.分摊
                    item["总计占比"] = ((公用花费总额 / 总价).toFixed(2) * 100) + `% =${公用花费总额}/${总价}`
                } else {
                    throw Error("BUG! 未完待续 值无效!")
                }
            }
            return res.reverse()
        }
    },
    methods: {
        分摊份额({ 学生, 失业 }) {
            return (学生 || 失业) ? 0.5 : 1
        }
    }
}).mount('main')