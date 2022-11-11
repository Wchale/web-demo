import {exam} from "@/apis/service";

//查询所有题目
export const selectAllQuestion = (param) => {
    return exam.get('selectAllQuestion?entryType=' + param.entryType + '&pageNum=' + param.pageNum + '&pageSize=5', {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

//添加试卷或修改试卷
export const insertPaper = (data, flag) => {
    return exam.post(flag ? 'updatePaper' : 'insertPaper', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

//查询试卷内容
export const selectPaperContent = (id) => {
    return exam.get('/selectPaperContent?id=' + id, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

//查询所有试卷
export const selectAllPaper = () => {
    return exam.post('/selectAllPaper', {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

//删除试卷
export const deletePaper = (id) => {
    return exam.get('/deletePaper?id=' + id, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

//预览
export const preview = (id) => {
    return exam.post('/conversionImg?id='+id, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}