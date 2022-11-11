import _ from 'lodash'
import {Message} from 'element-ui'

export default {
    state() {
        return {
            optionsData: {
                struct: {
                    title: {
                        name: '主标题',
                        disable: true,
                        select: true,
                        content: '请输入试卷主标题'
                    },
                    subTitle: {
                        name: '副标题',
                        select: false,
                        disable: false,
                        content: '请输入试卷副标题'
                    },
                    paperInfo: {
                        name: '试卷信息',
                        select: false,
                        disable: false,
                        content: '考试时间：**分钟；满分：**分',
                        score: 0,
                        duration: 0
                    },
                    examineeInput: {
                        name: '考生输入',
                        select: false,
                        disable: false,
                        content: '姓名：___________班级：___________学号：___________'
                    },
                    introduce: {
                        name: '试卷介绍',
                        select: false,
                        disable: false,
                        content: '试卷介绍'
                    },
                    beCareful: {
                        name: '注意事项',
                        select: false,
                        disable: false,
                        content: '1．答题前填写好自己的姓名、班级、考号等信息\n' +
                            '2．请将答案正确填写在答题卡上'
                    },
                },
                struct2: {
                    title: {
                        name: '主标题',
                        disable: true,
                        select: true,
                        content: '请输入试卷主标题'
                    },
                    subTitle: {
                        name: '副标题',
                        select: false,
                        disable: false,
                        content: '请输入试卷副标题'
                    },
                    paperInfo: {
                        name: '试卷信息',
                        select: false,
                        disable: false,
                        content: '考试时间：**分钟；满分：**分',
                        score: 0,
                        duration: 0
                    },
                    examineeInput: {
                        name: '考生输入',
                        select: false,
                        disable: false,
                        content: '姓名：___________班级：___________学号：___________'
                    },
                    introduce: {
                        name: '试卷介绍',
                        select: false,
                        disable: false,
                        content: '试卷介绍'
                    },
                    beCareful: {
                        name: '注意事项',
                        select: false,
                        disable: false,
                        content: '1．答题前填写好自己的姓名、班级、考号等信息\n' +
                            '2．请将答案正确填写在答题卡上'
                    },
                }
            },
            //显示在paper上的所有题目
            allTopic: [],
            volume: [],
            allScore: 0,
            allTopicNum: 0,
            insertPaper: {},
            pageSize:[
                {
                    name:'A4',
                    select:true,
                    content:'',
                    width:21,
                    height:29.7,
                    count:1,
                    clientWidth:794
                },
                {
                    name:'A3-2',
                    select:true,
                    content:'',
                    width:42,
                    height:29.7,
                    count:2,
                    clientWidth:1590
                },
                {
                    name:'A3-3',
                    select:true,
                    content:'',
                    width:42,
                    height:29.7,
                    count:3,
                    clientWidth:1590
                },
            ],
            paperIndex:0,
            count:2
        }
    },
    getters: {},
    mutations: {
        //新建分卷
        addVolume(state) {
            let obj = {
                title: '新建分卷',
                partTopicsDtoList: []
            }
            state.volume.push(_.cloneDeep(obj))
        },
        addAA(state){
            state.paperIndex++
        },
        changeCount(state, value){
            state.count = value
            this.commit('addAA')
        },
        addTopic(state, payload) {
            this.commit('addAA')
            //如果最后一个分卷的题型为空，则初始化
            if (state.volume[state.volume.length - 1].partTopicsDtoList === void 0) {
                let obj = {
                    partTopicsMainTitle: payload.title,
                    partTopicsSubTitle: '副标题',
                    infoQuestionList: []
                }
                obj.infoQuestionList.push(_.cloneDeep(payload.item))
                state.volume[state.volume.length - 1].partTopicsDtoList.push(_.cloneDeep(obj))
            }
            //如果arr为空，说明当前分卷没有当前题型
            const arr = state.volume[state.volume.length - 1].partTopicsDtoList.filter(item => item.partTopicsMainTitle === payload.title)
            if (arr.length === 0) {
                let obj = {
                    partTopicsMainTitle: payload.title,
                    partTopicsSubTitle: '副标题',
                    infoQuestionList: []
                }
                obj.infoQuestionList.push(_.cloneDeep(payload.item))
                state.volume[state.volume.length - 1].partTopicsDtoList.push(obj)
            } else {
                //将题目插入对应题型
                state.volume[state.volume.length - 1].partTopicsDtoList.forEach(item => {
                    if (item.partTopicsMainTitle === payload.title) {
                        let flag = true
                        item.infoQuestionList.forEach(subItem => {
                            if (subItem.id === payload.item.id) {
                                flag = false
                                Message({
                                    type: 'error',
                                    message: '试题不能重复添加'
                                })
                            }
                        })
                        if (flag) {
                            item.infoQuestionList.push(_.cloneDeep(payload.item))
                        }
                    }
                })
            }
            this.commit('addAllTopic')
        },
        //将所有题型连起来接为一个数组
        addAllTopic(state) {
            let arr = []
            for (let i = 0; i < state.volume[state.volume.length - 1].partTopicsDtoList.length; i++) {
                arr = _.concat(arr, state.volume[state.volume.length - 1].partTopicsDtoList[i].infoQuestionList)
            }
            state.allTopic = _.cloneDeep(arr)
            this.commit('allScore')
        },
        //删除某个题目
        delItem(state, payload) {
            const {id, volumeIndex} = payload
            state.volume[volumeIndex].partTopicsDtoList.forEach((item, index2) => {
                item.infoQuestionList.forEach((subItem, index) => {
                    if (subItem.id === id) {
                        _.pullAt(item.infoQuestionList, index)
                        if (item.infoQuestionList.length === 0) {
                            _.pullAt(state.volume[volumeIndex].partTopicsDtoList, index2)
                        }
                    }
                })
            })
            this.commit('allScore')
        },
        //算总题数
        allScore(state) {
            let count = 0
            state.volume.forEach(item => {
                item.partTopicsDtoList.forEach(subItem => {
                    subItem.infoQuestionList.forEach(() => {
                        count++
                    })
                })
            })
            state.allTopicNum = count
        },
        //配置添加试卷接口需要的数据
        insertPaper(state) {
            //配置试卷基本信息
            const struct = state.optionsData.struct

            state.insertPaper.mainTitle = struct.title.content

            if (!struct.subTitle.select) {
                state.insertPaper.subTitle = ''
            } else {
                state.insertPaper.subTitle = struct.subTitle.content
            }

            if (struct.introduce.select) {
                state.insertPaper.introduce = struct.introduce.content
            } else {
                state.insertPaper.introduce = ''
            }

            state.insertPaper.name = ''

            const obj = {
                paperInfo: struct.paperInfo,
                examineeInput: struct.examineeInput,
            }

            state.insertPaper.info = JSON.stringify(obj)
            state.insertPaper.columns = state.count

            if (struct.beCareful.select) {
                state.volume.forEach(item => {
                    item.precautions = struct.beCareful.content
                })
            }

            let copyVolume = _.cloneDeep(state.volume)

            let subData = []

            //和更新试卷一样
            copyVolume.forEach(item => {
                item.partTopicsDtoList.forEach(subItem => {
                    let length = subItem.infoQuestionList.length
                    for (let i = 0; i < length; i++) {
                        if (subItem.infoQuestionList[i].infoQuestionList != void 0) {
                            subItem.infoQuestionList[i].infoQuestionList.forEach(thirdItem => {
                                const newItem2 = _.omit(thirdItem, ['id', 'partTopicsId']);
                                subData.push(newItem2)
                            })
                            _.reverse(subData)
                            subData.forEach(forthItem => {
                                subItem.infoQuestionList.splice(i + 1, 0, _.cloneDeep(forthItem))
                            })
                            const newItem = _.omit(subItem.infoQuestionList[i], ['id', 'partTopicsId', 'infoQuestionList']);
                            subItem.infoQuestionList[i] = newItem
                            length = subItem.infoQuestionList.length
                            i = i + subData.length
                            subData = []
                        } else {
                            const newItem = _.omit(subItem.infoQuestionList[i], ['id', 'partTopicsId']);
                            subItem.infoQuestionList[i] = newItem
                        }
                    }
                })
            })

            state.insertPaper.partDtoList = _.cloneDeep(copyVolume)
        },

        //更新试卷
        updatePaper(state, payload) {
            let copyVolume = _.cloneDeep(state.volume)
            let subData = []
            copyVolume.forEach((item, index) => {
                //删除掉所有item中跟id有关的，除了parentId
                copyVolume[index] = _.cloneDeep(_.omit(item, ['id', 'paperId']))
                item.partTopicsDtoList.forEach((subItem, subIndex) => {
                    let length = subItem.infoQuestionList.length
                    for (let i = 0; i < length; i++) {
                        if (subItem.infoQuestionList[i].infoQuestionList != void 0) {
                            //把组合题的子题目拿出来，和父题同级
                            subItem.infoQuestionList[i].infoQuestionList.forEach(thirdItem => {
                                const newItem2 = _.omit(thirdItem, ['id', 'partTopicsId']);
                                //暂存
                                subData.push(newItem2)
                            })
                            //倒序
                            _.reverse(subData)
                            //将subData中的数据放入subItem， 和父题同级
                            subData.forEach(forthItem => {
                                subItem.infoQuestionList.splice(i + 1, 0, _.cloneDeep(forthItem))
                            })
                            const newItem = _.omit(subItem.infoQuestionList[i], ['id', 'partTopicsId', 'infoQuestionList']);
                            //更新length
                            length = subItem.infoQuestionList.length
                            subItem.infoQuestionList[i] = newItem
                            //更新i
                            i = i + subData.length
                            subData = []
                        } else {
                            //如果没有infoQuestionList这个属性，代表没有子题，直接删除id相关内容即可
                            const newItem = _.omit(subItem.infoQuestionList[i], ['id', 'partTopicsId']);
                            subItem.infoQuestionList[i] = newItem
                        }
                    }
                    copyVolume[index].partTopicsDtoList[subIndex] = _.cloneDeep(_.omit(subItem, ['id', 'partId']))
                })
            })

            //配置试卷基本信息
            payload.partDtoList = _.cloneDeep(copyVolume)

            state.insertPaper = _.cloneDeep(payload)

            const struct = state.optionsData.struct

            state.insertPaper.mainTitle = struct.title.content

            if (!struct.subTitle.select) {
                state.insertPaper.subTitle = ''
            } else {
                state.insertPaper.subTitle = struct.subTitle.content
            }

            if (struct.introduce.select) {
                state.insertPaper.introduce = struct.introduce.content
            } else {
                state.insertPaper.introduce = ''
            }

            state.insertPaper.name = ''

            const obj = {
                paperInfo: struct.paperInfo,
                examineeInput: struct.examineeInput,
            }

            state.insertPaper.info = JSON.stringify(obj)
            state.insertPaper.columns = state.count

            if (struct.beCareful.select) {
                state.volume.forEach(item => {
                    item.precautions = struct.beCareful.content
                })
            } else {
                state.insertPaper.partDtoList.forEach(item => {
                    item.precautions = ''
                })
            }
        },
    },
}