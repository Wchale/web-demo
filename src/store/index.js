import Vue from 'vue'
import Vuex from 'vuex'
import sheet from './sheet'
import paper from "@/store/paper";
import test from "@/store/test";

Vue.use(Vuex)

export default new Vuex.Store({
    state() {
        return {}
    },
    mutations: {},
    actions: {},
    modules: {sheet, paper, test}
})
