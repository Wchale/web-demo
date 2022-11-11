export default {
    state() {
        return {
            startpage:1,
            startnum:0,
            sheetData:{},
            uid:0
        }
    },
    getters: {
    },
    mutations: {
        addSheetData(state, payload){
            state.sheetData[0] = payload;
        },
        addUid(state){
            state.uid++
        }
    },
}