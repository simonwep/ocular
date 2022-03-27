import {computed, ref, Ref} from 'vue';

export const useCurrencyFormatter = (
    v?: Ref<number | undefined>,
    locale: Ref<string> = ref('en-us'),
    currency: Ref<string> = ref('USD')
): Ref<string | undefined> => {
    return computed(() => {
        return new Intl.NumberFormat(locale.value, {
            currency: currency.value,
            style: 'currency'
        }).format(v?.value ?? 0);
    });
};
