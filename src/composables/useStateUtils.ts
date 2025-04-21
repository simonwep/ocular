import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';

export const useStateUtils = () => {
  const { state } = useDataStore();
  const { state: settings } = useSettingsStore();

  const isCurrentMonth = (index: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const offsetIndex = (index + settings.general.monthOffset) % 12;

    if (state.activeYear === currentYear - 1 && settings.general.monthOffset > currentMonth) {
      return offsetIndex === currentMonth;
    }

    if (state.activeYear !== currentYear || currentMonth < settings.general.monthOffset) {
      return false;
    }

    return offsetIndex === currentMonth;
  };

  return { isCurrentMonth };
};
