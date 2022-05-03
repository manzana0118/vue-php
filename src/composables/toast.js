import { computed } from 'vue'
import { useStore } from 'vuex'

export const useToast = () => {

    const store = useStore();

    // 안내창
    const toastMessage = computed( () => store.state.toastMessage);
    const toastShow = computed( () => store.state.toastShow);

    const triggerToast = (_m) => {
        store.dispatch('triggerToast', _m);
    }

    return {
        toastMessage,
        toastShow,
        triggerToast
    }
};