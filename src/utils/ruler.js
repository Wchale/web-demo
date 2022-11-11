import store from "@/store";
import _ from "lodash";

// 其他规则
function otherRule(lastTop, data) {
    const sheet = store.state.sheet
    // 渲染标题
    if (data.type === void 0) {
        const executed = {
            top: sheet.lastTop,
            left: sheet.lastLeft,
            pageNumber: sheet.allowAddPageNum,
        }
        store.commit('updateSheetValue', {key: 'lastTop', value: lastTop + data.height + 20})
        return executed
    } else if (data.type === 'Mate') {
        // 渲染 注意事项
        const executed = {
            top: sheet.lastTop,
            left: sheet.lastLeft,
            pageNumber: sheet.allowAddPageNum,
        }
        // let height = store.getters.pageColumn === 3 ? 333 : 270
        let height = store.getters.pageColumn === 3 ? 243 : 175
        // height += store.state.sheet.infoType.length >= 4 ? 31 : 0
        store.commit('updateSheetValue', {key: 'lastTop', value: lastTop + height + 20})
        return executed
    }
}

// 客观题规则
function objectiveRule(lastTop, data) {
    const {title, options, otherHeight} = data
    console.log('%c 客观题:', 'font-size: 20px;color:#84a729', data)

    // 获取纸张大小
    const A3_3Paper = store.state.sheet.paperSize === 'A3-3';
    // 获取页面宽度
    const paperCol = store.getters.paperColumnWidth;
    // 获取客观题的排列方式: true为横向排列, false为竖向排列
    const objectiveArrayType = store.state.sheet.objectiveArrayType;
    let _options = []
    const len = options.length
    let count = 0;
    for (let i = 0; i < len; i++) {
        // 横向排列
        if (objectiveArrayType) {
            // 页面宽度 487
            if (A3_3Paper) {
                // 选项数量大于5个
                if (options.filter((option) => {return option.optionCount > 5}).length > 0) {
                    _options[count++] = {width: paperCol / 2, height: 90, option: options.slice(i, i + 10)}
                    i = i + 9
                } else {
                    _options[count++] = {width: paperCol / 3, height: 90, option: options.slice(i, i + 15)}
                    i = i + 14
                }
            } else {
                // 页面宽度 690
                if (options.filter((option) => {return option.optionCount > 5}).length > 0) {
                    _options[count++] = {width: paperCol / 3, height: 90, option: options.slice(i, i + 15)}
                    i = i + 14
                } else {
                    _options[count++] = {width: paperCol / 4, height: 90, option: options.slice(i, i + 20)}
                    i = i + 19
                }
            }
        } else {
            // 竖向排列
            if (A3_3Paper) {
                _options[count++] = {width: paperCol / 3, option: options.slice(i, i + 15)}
                i = i + 14
            } else {
                _options[count++] = {width: paperCol / 4, option: options.slice(i, i + 20)}
                i = i + 19
            }
        }
    }
    if (!objectiveArrayType) {
        // 竖向排列,设置每个选项块高度
        _options.forEach(item => {
            const maxCount = Math.max(...item.option.map(subItem => subItem.optionCount))
            item.height = 12 * maxCount + (maxCount - 1) * 6 + 26
        })
    }
    _options.forEach(item => {
        item.option = _.chunk(item.option, 5)
    })
    const executed = []
    const top = objectiveRecursion(lastTop + otherHeight, _options, executed)
    store.commit('updateSheetValue', {key: 'lastTop', value: top + 20})
    executed[0].data.title = title;
    return executed
}

// 客观题递归
function objectiveRecursion(top, options, executed) {
    const sheet = store.state.sheet
    // 每一栏固定高度 1077
    const columnHeight = sheet.columnHeight + 45
    for (const item of options) {
        const index = options.indexOf(item)
        // 超出栏固定高度
        if (top + item.height > columnHeight) {
            // 如果是第一行
            if (index === 0) {
                store.commit('pageColFull')
                return objectiveRecursion(81, options, executed)
            } else {
                const drop = options.splice(index)
                executed.push({
                    top: sheet.lastTop,
                    left: sheet.lastLeft,
                    pageNumber: sheet.allowAddPageNum,
                    data: {options}
                })
                store.commit('pageColFull')
                return objectiveRecursion(56, drop, executed)
            }
        } else {
            top += item.height
        }
    }
    executed.push({
        top: sheet.lastTop,
        left: sheet.lastLeft,
        pageNumber: sheet.allowAddPageNum,
        data: {options}
    })
    return top
}

// 填空题规则
function fillBlankRule(lastTop, data) {
    const sheet = store.state.sheet
    const {title, otherHeight, numbers, itemScore} = data
    const executed = []
    const contents = _.cloneDeep(data.contents)
    const len = contents.length;
    let top = lastTop + otherHeight;
    const columnHeight = sheet.columnHeight + 45;
    let startIndex = 0;
    const itemHeight = 36
    for (let i = 0; i < len; i++) {
        if (top + itemHeight > columnHeight) {
            if (i === 0) {
                store.commit('pageColFull')
                top = 70;
                i--;
            } else {
                executed.push({
                    top: sheet.lastTop,
                    left: sheet.lastLeft,
                    pageNumber: sheet.allowAddPageNum,
                    data: {
                        contents: contents.slice(startIndex, i),
                        startIndex,
                        len: contents.slice(startIndex, i).length,
                        remainSize: columnHeight - top, numbers, itemScore
                    }
                })
                startIndex = i;
                store.commit('pageColFull')
                top = 46;
                i--;
            }
        } else {
            top += itemHeight;
        }
    }
    const fillBlank = {
        top: sheet.lastTop,
        left: sheet.lastLeft,
        pageNumber: sheet.allowAddPageNum,
        data: {
            contents: contents.slice(startIndex),
            startIndex,
            len: contents.slice(startIndex).length,
            numbers,
            itemScore
        }
    }
    if (top + itemHeight > columnHeight) {
        fillBlank.data.remainSize = columnHeight - top;
    }
    executed.push(fillBlank)
    store.commit('updateSheetValue', {key: 'lastTop', value: top + 20})
    executed[0].data.title = title
    return executed
}

// 作文题规则
function compositionRule(lastTop, data) {
    const sheet = store.state.sheet
    // const columnHeight = store.state.sheet.columnHeight + 10;
    const columnHeight = store.state.sheet.columnHeight + 45;
    // console.log(columnHeight)
    // const colCount = store.getters.pageColumn === 3 ? 19 : 27
    // 作文每行格子数量
    const colCount = store.getters.pageColumn === 3 ? 14 : 22
    const executed = []
    let {title, score, itemFixedHeight, number, otherHeight} = data
    // let {title, score, number, otherHeight} = data
    let numberOfWord = data.numberOfWord
    let sum = numberOfWord
    let preWord = 0;
    let row = 1;
    let top = lastTop + otherHeight; // 19
    if (top > columnHeight) {
        store.commit('pageColFull')
        top = 45 + otherHeight;
    }
    while (numberOfWord > 0) {
        // console.log(top)
        if (top + itemFixedHeight >= columnHeight) {
        // if (top + 40 >= columnHeight) {
            const data = {
                score, colCount, preWord, sum, number,
                remainSize: columnHeight - top,
            }
            // word 获取当前页最大字数
            let word = colCount * (row - 2);
            // if (numberOfWord < word) {
            //     word -= colCount
            // }
            data.numberOfWord = word
            executed.push({
                top: sheet.lastTop,
                left: sheet.lastLeft,
                pageNumber: sheet.allowAddPageNum,
                data
            })
            if (numberOfWord > word) {
                store.commit('pageColFull')
            } else {
                store.commit('updateSheetValue', {key: 'lastTop', value: sheet.columnHeight})
            }
            numberOfWord -= word
            preWord += word;
            row = 1;
            top = 45;
        } else {
            top += itemFixedHeight
            row++
        }
    }
    executed[0].data.title = title
    return executed
}

// 解答题规则
function answerRule(lastTop, data) {
    const {title, otherHeight} = data
    const otherList = []
    const sheet = store.state.sheet
    // 题目列表
    const list = _.cloneDeep(data.list)
    console.log(list,'listttttttttttttttttttttt')
    let len = list.length
    let top = lastTop + otherHeight
    const columnHeight = sheet.columnHeight + 45
    let startIndex = 0

    console.log('%c base-Info:', 'font-size: 20px;color:red', len, lastTop , otherHeight, columnHeight, otherList)
    for (let i = 0; i < len; i++) {
        // 超出本页高度
        console.log(top, list[i], columnHeight, i,  '// 获取高度// 获取高度')
        if (top + list[i].height > columnHeight) {
            console.log('%c iii // 超出本页高度:', 'font-size: 20px;color:red', top, i, list[i], columnHeight)
            // 如果题块第一项与本栏底部空间高度差小于45, 切换到第二栏
            if (i === 0 && (columnHeight - top) < 45) {
                store.commit('pageColFull')
                top = 69
                i--
            } else {
                // 获取高度差, 拿到当前栏剩余空间
                let differenceHeight = columnHeight - top // (1059 - 1049 = 10)
                // 获取高度差 , 判断剩余空间是否可以容纳当前题块, 否则切块
                let differenceHeight2 = list[i].height - differenceHeight // (51 - 10 = 41)
                let obj = _.cloneDeep(list[i])
                // 复制题块
                list[i].height = differenceHeight - 10 // 0
                obj.height = differenceHeight2 + 10 // 51
                obj.uid = store.state.test.uid
                obj.score = 0
                store.commit('addUid')
                let arr = obj.content.split('</p>')
                // 插入新题块
                list.splice(i + 1, 0, obj)
                len++
                let content = ""
                let content2 = ""
                console.log('%c 切割题块:', 'font-size: 20px;color: black', columnHeight, top, differenceHeight, list[i].height, arr)
                for (let q = 0; q < arr.length - 1; q++) {
                    // 高度差小于（行数 * 18）, 内容溢出时, 分割内容
                    if (differenceHeight < (q + 2) * 18) {
                        for (let j = 0; j < q; j++) {
                            content = content + arr[j] + '</p>'
                        }
                        for (let k = q; k < arr.length - 1; k++) {
                            content2 = content2 + arr[k] + '</p>'
                        }
                        let height = (arr.length - q + 1) * 18
                        if (height > differenceHeight2) {
                            differenceHeight2 = height
                        }
                        if (content2 !== "") {
                            obj.content = content2
                        }
                        if (content !== "") {
                            list[i].content = content
                        }
                        break
                    } else {
                        // 高度差大于（行数 * 18）
                        obj.content = '<p>' + obj.flag + '(续) 、</p>'
                    }
                }
                if (list[i].content === "") {
                    list[i].content = '<p>' + list[i].number + '、</p>'
                }
                otherList.push({
                    top: sheet.lastTop,
                    left: sheet.lastLeft,
                    pageNumber: sheet.allowAddPageNum,
                    data: {
                        list: list.slice(startIndex, i + 1),
                        startIndex,
                        len: list.slice(startIndex, i + 1).length,
                        remainSize: columnHeight - top
                    }
                })
                startIndex = i + 1
                store.commit('pageColFull')
                top = 46;
            }
        } else {
            top += list[i].height
        }
    }
    const obj = {
        top: sheet.lastTop,
        left: sheet.lastLeft,
        pageNumber: sheet.allowAddPageNum,
        data: {list: list.slice(startIndex), startIndex, len: list.slice(startIndex).length}
    }
    if (top + 150 > columnHeight) {
        obj.data.remainSize = columnHeight - top
    }

    otherList.push(obj)
    console.log('%c obj:', 'font-size: 20px;color:blue', obj, otherList)

    store.commit('updateSheetValue', {key: 'lastTop', value: top + 20})
    otherList[0].data.title = title
    for (let x = 0; x < otherList.length; x++) {
        for (let y = 0; y < otherList[x].data.list.length; y++) {
            if (otherList[x].data.list[y].height <= 0) {
                otherList[x].data.list.splice(y, 1)
            }
        }
    }
    for (let x = 0; x < otherList.length; x++) {
        for (let y = 0; y < otherList[x].data.list.length - 1; y++) {
            if (otherList[x].data.list[y].number === otherList[x].data.list[y + 1].number) {
                otherList[x].data.list[y].height += otherList[x].data.list[y + 1].height
                let arr = otherList[x].data.list[y + 1].content.split('</p>')
                let arr2 = otherList[x].data.list[y].content.split('</p>')
                if (arr.length > 2) {
                    otherList[x].data.list[y].content += otherList[x].data.list[y + 1].content
                } else if (arr2.length < 2) {
                    otherList[x].data.list[y].content = otherList[x].data.list[y + 1].content
                }
                otherList[x].data.list.splice(y + 1, 1)
            }
        }
    }
    return otherList
}

// 给题块提供其对应的换行换页规则
export const ruleSet = {
    title: otherRule,
    mate: otherRule,
    objective: objectiveRule,
    fillBlank: fillBlankRule,
    composition: compositionRule,
    answer: answerRule,
}
