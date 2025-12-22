import { DataState } from '../types';
import { uuid } from '@utils/uuid.ts';
import { useI18n } from 'vue-i18n';

// Module is dynamically loaded so injected composables cannot be used here directly.
export const generateDemoData = (
  currency: DataState['currency'],
  locale: DataState['locale'],
  t: ReturnType<typeof useI18n>['t']
): DataState => {
  const year = new Date().getFullYear();

  return {
    version: 3,
    currency,
    locale,
    years: [
      {
        year: year - 1,
        expenses: [
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.children'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.activities'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.medical'),
                values: [20, 20, 200, 20, 20, 20, 200, 20, 20, 20, 200, 20]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.childcare'),
                values: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.school'),
                values: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.debt'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.studentLoans'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.education'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.musicLessons'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.entertainment'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.concertsShows'),
                values: [0, 0, 0, 0, 600, 0, 0, 0, 0, 450, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.music'),
                values: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.theatrePlays'),
                values: [0, 60, 0, 0, 0, 0, 75, 0, 0, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.everyday'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.groceries'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.restaurants'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.personalSupplies'),
                values: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.subscriptions'),
                values: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.gifts'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.gifts'),
                values: [0, 0, 100, 0, 0, 0, 200, 0, 0, 0, 0, 400]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.donationsCharity'),
                values: [75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.healthMedical'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.doctorsDentalVision'),
                values: [0, 60, 0, 0, 60, 0, 0, 60, 0, 0, 60, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.home'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.rentMortgage'),
                values: [1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.propertyTaxes'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.insurance'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.car'),
                values: [0, 300, 0, 0, 300, 0, 0, 300, 0, 0, 300, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.health'),
                values: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.transportation'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.fuel'),
                values: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.supplies'),
                values: [0, 0, 300, 0, 0, 0, 0, 0, 0, 300, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.travel'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.airfare'),
                values: [0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.hotels'),
                values: [0, 0, 0, 0, 0, 500, 0, 0, 0, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.utilities'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.phone'),
                values: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.internet'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.electricity'),
                values: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.gas'),
                values: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.water'),
                values: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          }
        ],
        income: [
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.income.wages'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.paySlip'),
                values: [7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.bonus'),
                values: [0, 0, 500, 0, 0, 0, 0, 1500, 0, 0, 0, 1000]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.income.other'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.interestIncome'),
                values: [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.dividends'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          }
        ]
      },
      {
        year: year,
        income: [
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.income.wages'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.paySlip'),
                values: [8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.bonus'),
                values: [0, 0, 0, 0, 0, 0, 0, 2000, 0, 0, 0, 1000]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.income.other'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.interestIncome'),
                values: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.dividends'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.income.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          }
        ],
        expenses: [
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.children'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.activities'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.medical'),
                values: [20, 20, 200, 20, 20, 20, 200, 20, 20, 20, 200, 20]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.childcare'),
                values: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.debt'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.studentLoans'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.education'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.musicLessons'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.entertainment'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.concertsShows'),
                values: [0, 0, 0, 0, 600, 0, 0, 0, 0, 450, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.music'),
                values: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.theatrePlays'),
                values: [0, 60, 0, 0, 0, 0, 75, 0, 0, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.everyday'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.groceries'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.restaurants'),
                values: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.personalSupplies'),
                values: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.subscriptions'),
                values: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.gifts'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.gifts'),
                values: [0, 0, 100, 0, 0, 0, 200, 0, 0, 0, 0, 400]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.donationsCharity'),
                values: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.healthMedical'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.doctorsDentalVision'),
                values: [0, 60, 0, 0, 60, 0, 0, 60, 0, 0, 60, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.home'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.rentMortgage'),
                values: [2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.propertyTaxes'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2000]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.insurance'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.car'),
                values: [0, 300, 0, 0, 300, 0, 0, 300, 0, 0, 300, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.health'),
                values: [200, 200, 200, 200, 200, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.transportation'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.fuel'),
                values: [120, 120, 120, 120, 120, 140, 140, 140, 140, 140, 140, 140]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.supplies'),
                values: [0, 0, 300, 0, 0, 0, 0, 0, 0, 300, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.travel'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.airfare'),
                values: [1000, 0, 0, 0, 0, 1000, 0, 0, 1000, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.hotels'),
                values: [300, 0, 0, 0, 0, 500, 0, 0, 250, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('navigation.tools.demo.data.expenses.utilities'),
            budgets: [
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.phone'),
                values: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.internet'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.electricity'),
                values: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.gas'),
                values: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.water'),
                values: [20, 20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25]
              },
              {
                id: uuid(),
                name: t('navigation.tools.demo.data.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          }
        ]
      }
    ]
  };
};
