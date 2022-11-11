import {sheet} from "@/apis/service";

// 创建答题卡
export const createAs = (data) => {
    return sheet.post('answerSheet/create', data)
}

// 获取答题卡列表
export const listAs = (creator) => {
    return sheet.get(`answerSheet/byCreator/${creator}`)
}

// 删除答题卡
export const deleteAs = (id) => {
    return sheet.delete(`answerSheet/byId/${id}`)
}

// 查询答题卡详情
export const detailAs = (id) => {
    return sheet.get(`answerSheet/byId/${id}`)
}

// 更新答题卡
export const updateAs = (data) => {
    return sheet.put(`answerSheet/byId`, data)
}

// 上传答题卡图片
export const uploadAs = (formData) => {
    return sheet.post('answerSheet/image', formData)
}

// 添加题块列表
export const addAsList = (list) => {
    return sheet.post('questBlock/addList', list)
}

// 切图操作
export const cutImg = (id) => {
    return sheet.post('cutImage/image', {id})
}

// 查询切图结果
export const getCutImg = (id) => {
    return sheet.get(`cutImage/infoByAsId/${id}`)
}
