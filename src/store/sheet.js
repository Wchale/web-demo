import AsTitle from "@/components/sheet/modules/AsTitle";
import AsMate from "@/components/sheet/modules/AsMate";
import {ruleSet} from "@/utils";
import _ from "lodash";
import AsObjective from "@/components/sheet/modules/AsObjective";
import AsFillBlank from "@/components/sheet/modules/AsFillBlank";
import AsAnswerQuestion from "@/components/sheet/modules/AsAnswerQuestion";
import AsComposition from "@/components/sheet/modules/AsComposition";

export default {
    state() {
        return {
            // 纸张大小：默认三种类型(A3/两栏,A3/三栏,A4一栏)
            paperSize: 'A3-3',

            // 该答题卡有多少页
            pageCount: 1,

            mainTitle: '请输入试卷主标题',
            subTitle: '请输入试卷副标题',

            // 考号位数
            candidateNumber: 8,

            // 学生填写信息的种类
            infoType: ['姓名', '学校'],

            // 客观题的排列方式: true为横向排列, false为竖向排列
            objectiveArrayType: true,

            // 套红印刷
            themeColor: true,
            moduleComponents: {
                title: AsTitle,
                mate: AsMate,
                objective: AsObjective,
                fillBlank: AsFillBlank,
                answer: AsAnswerQuestion,
                composition: AsComposition
            },
            modules: [],
            moduleData: [
                {
                    // 统计题目时不算上改题块
                    disabled: true,
                    ruleType: 'title',
                    data: {
                        height: 74,
                    }
                }, {
                    // 统计题目时不算上改题块
                    disabled: true,
                    ruleType: 'mate',
                    data: {
                        type: 'Mate'
                    }
                }
            ],

            // 题号
            numbers: [],

            moduleId: 1,

            // 每一栏固定高度
            // columnHeight: 1077,
            columnHeight: 1014,
            // lastTop: 45,
            lastTop: 45,
            // lastLeft: 52,
            lastLeft: 45.75,

            // 当前第几页允许添加组件
            allowAddPageNum: 1,
            // 当前第几列允许添加组件
            allowAddPageCol: 1,

            // 定位锚坐标
            position: [],
            anchorH: 15,
            anchorW: 30,

        }
    },
    getters: {
        pageColumn(state) {
            return Number(state.paperSize.split('-')[1])
        },
        paperWidth(state) {
            // return state.paperSize.indexOf('A3') > -1 ? 1588 : 794
            return state.paperSize.indexOf('A3') > -1 ? 1560 : 780
        },
        paperHeight() {
            // return 1122
            return 1104
        },
        paperColumnWidth(state) {
            // return state.paperSize.indexOf('-3') > -1 ? 487 : 690

            return state.paperSize.indexOf('-3') > -1 ? 472 : (state.paperSize.indexOf('A3') > -1 ? 724 : 688)
        },
        getUid(state) {
            return 'module-' + state.moduleId
        }
    },
    mutations: {
        // 初始化仓库数据
        initSheetStore(state, payload) {
            for (const key in payload) {
                state[key] = payload[key]
            }
        },
        updateSheetValue(state, {key, value}) {
            state[key] = value
        },
        addNumber(state, number) {
            state.numbers.push(...number)
            state.numbers.sort((a, b) => a - b)
        },
        numberIsOnly(state, payload) {
            let temp = [];
            for (let i = payload.sn; i <= payload.en; i++) {
                temp.push(i)
            }
            temp = state.numbers.concat(temp)
            const check = _.union(temp)
            if (check.length === temp.length) {
                state.numbers = check
            } else {
                payload.flag = true
            }
        },
        removeNumber(state, number) {
            if (number instanceof Array) {
                number.map(num => {
                    _.remove(state.numbers, (item) => item === num)
                })
            } else {
                _.remove(state.numbers, (item) => item === number)
            }
        },
        changeMateHeight(state, itemFixedHeight) {
            state.moduleData[1].mate.itemFixedHeight = itemFixedHeight
        },
        reset(state) {
            state.lastTop = 45;
            // state.lastLeft = 52;
            // state.lastLeft = 45.75;
            state.lastLeft = state.paperSize.indexOf('-3') > -1 ? 45.75 : 46;
            state.allowAddPageCol = 1;
            state.allowAddPageNum = 1;
            state.pageCount = 1
        },
        executeRule(state) {
            this.commit('reset')
            const modules = []
            console.log(state.moduleData, 'state.moduleData')
            state.moduleData.forEach((item) => {
                let result = ruleSet[item.ruleType](state.lastTop, item?.data)
                console.log(result, '=====================.result', item.ruleType)
                if (result instanceof Array) {
                    result.forEach(subItem => {
                        // 根据ruleType存入vnode组件
                        subItem.module = state.moduleComponents[item.ruleType]
                        // 传入props值
                        subItem.dataId = item.dataId
                        subItem.uid = this.getters.getUid
                        state.moduleId++
                        modules.push(subItem)
                    })
                } else {
                    // 作文
                    result.module = state.moduleComponents[item.ruleType]
                    result.uid = this.getters.getUid
                    state.moduleId++
                    modules.push(result)
                }
            })
            state.modules = modules
        },
        addModuleData(state, {ruleType, module, data}) {
            let dataId = state.moduleData.findLast(item => item)?.dataId
            dataId === void 0 ? dataId = 1 : dataId++
            state.moduleData.push({ruleType, module, dataId, data})
            this.commit('executeRule')
        },
        removeModuleData(state, dataId) {
            state.moduleData.some((item, index) => {
                if (item.dataId === dataId) {
                    state.moduleData.splice(index, 1)
                    return true;
                }
            })
            this.commit('executeRule')
        },
        updateModuleData({moduleData}, {dataId, data}) {
            const temp = moduleData.filter((item) => item.dataId === dataId).map(item => {
                item.data = data
                return item
            })
            moduleData.forEach((item, index) => {
                if (item.dataId === dataId) {
                    moduleData.splice(index, 1, temp[0])
                }
            })
            this.commit('executeRule')
        },
        replacePosModuleData({moduleData}, {sourceId, targetId}) {
            const indices = []
            moduleData.map((item, index) => {
                if (item.dataId === sourceId) {
                    indices[0] = index
                } else if (item.dataId === targetId) {
                    indices[1] = index
                }
            });
            const drop = moduleData.splice(indices[0], 1)
            moduleData.splice(indices[1], 0, ...drop)
        },
        // 切割纸张
        pageColFull(state) {
            if (state.allowAddPageCol === this.getters.pageColumn) {
                state.pageCount++;
                state.allowAddPageNum++
                state.allowAddPageCol = 1;
                // state.lastLeft = 52;
                state.lastLeft = state.paperSize.indexOf('-3') > -1 ? 45.75 : 46;
                state.lastTop = 45;
            } else {
                state.allowAddPageCol++;
                // 纸张间距
                // const space = state.paperSize.indexOf('-3') > -1 ? 10 : 40;
                const space = state.paperSize.indexOf('-3') > -1 ? 26.5 : 26;
                state.lastLeft = state.lastLeft + this.getters.paperColumnWidth + space;
                state.lastTop = 45;
            }
        }
    },
}
