import { createStore } from "vuex"

export default createStore({
    state: {
        toastMessage: '',
        toastShow: false
    },
    mutations: {
        UPDATE_MESSAGE(state, payload){
            state.toastMessage = payload;
        },
        UPDATE_STATE(state, payload){
            state.toastShow = payload;
        }
    },
    actions: {
        triggerToast ({commit},_m) {
            commit('UPDATE_MESSAGE', _m);
            commit('UPDATE_STATE', true);
            setTimeout(() => {
                commit('UPDATE_STATE', false);
                commit('UPDATE_MESSAGE', '');
            }, 2000);
        }
    },
    getters: {}
});