import {onMounted, ref, Ref} from 'vue';

export const useAppElement = (): Ref<HTMLElement | undefined> => {
    const app = ref<HTMLElement>();
    onMounted(() => app.value = document.getElementById('app') as HTMLElement);
    return app;
};
