let 剩下的凉面比例 = 6.5 / 25

export default {
    "买": [
        {
            "人": "周鹤",
            "东西": [
                {
                    "啥": "肉9斤",
                    "消耗": 116
                },
                {
                    "啥": "凉面25斤",
                    "消耗": 63,
                    "私分": 63 * 剩下的凉面比例
                },
                {
                    "啥": "香菜",
                    "消耗": 12.7
                },
                {
                    "啥": "胡萝卜",
                    "消耗": 9.9
                },
                {
                    "啥": "葱",
                    "消耗": 5
                }, {
                    "啥": "姜",
                    "消耗": 4.7
                }, {
                    "啥": "蒜",
                    "消耗": 5
                },
                {
                    "啥": "黄瓜",
                    "消耗": 25
                },
                {
                    "啥": "花生2.4斤",
                    "消耗": 24
                },
                {
                    "啥": "一次性杯子",
                    "消耗": 5
                },
                {
                    "啥": "花生油",
                    "消耗": 49.9 * (2.35 / 4.45),
                    "总价": 49.9,
                    "未完待续": true,
                    "使用情况": "4.45千克中用了2.35千克"
                },
            ]
        }, {
            "人": "杨贵龙",
            "东西": [
                {
                    "啥": "一次性塑料碗180套",
                    "消耗": 67.9 * 29 / 180,
                    "未完待续": true,
                    "总价": 67.9,
                    "使用情况": "180个里用了29个"
                },
                {
                    "啥": "塑料袋杯",
                    "消耗": 5.19
                },
                {
                    "啥": "醋、生抽、老抽",
                    "消耗": 30
                }
            ]
        }, {
            "人": "高佳裕",
            "东西": [
                {
                    "啥": "青菜",
                    "消耗": 2,
                },
                {
                    "啥": "香肠",
                    "消耗": 6,
                }
            ]
        }, {
            "人": "朱佳炀",
            "东西": [
                {
                    "啥": "塑料碗200个",
                    "消耗": 65 * 60 / 200,
                    "总价": 65,
                    "私分": 65 * (60 - 21) / 200,
                    "未完待续": "已用完",
                    "使用情况": "有60个碗，但只有21个盖子，所以用了21个，剩下39个私分了。"
                }
            ]
        }
    ],
    "做": [
        {
            "人": "周鹤"
        }, {
            "人": "杨贵龙",
            "失业": true
        }, {
            "人": "张智超"
        }, {
            "人": "吴明净",
        }, {
            "人": "朱佳炀"
        }, {
            "人": "陶羽婷",
            "学生": true
        }, {
            "人": "高佳裕",
        }
    ]
}