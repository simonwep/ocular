import { DataState } from '../types';
import { uuid } from '@utils/uuid/uuid.ts';
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
            name: t('feature.templates.demo.expenses.children'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.activities'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.medical'),
                values: [20, 20, 200, 20, 20, 20, 200, 20, 20, 20, 200, 20]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.childcare'),
                values: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.school'),
                values: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.debt'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.studentLoans'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.education'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.musicLessons'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.entertainment'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.concertsShows'),
                values: [0, 0, 0, 0, 600, 0, 0, 0, 0, 450, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.music'),
                values: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.theatrePlays'),
                values: [0, 60, 0, 0, 0, 0, 75, 0, 0, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.everyday'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.groceries'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.restaurants'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.personalSupplies'),
                values: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.subscriptions'),
                values: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.gifts'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.gifts'),
                values: [0, 0, 100, 0, 0, 0, 200, 0, 0, 0, 0, 400]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.donationsCharity'),
                values: [75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.healthMedical'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.doctorsDentalVision'),
                values: [0, 60, 0, 0, 60, 0, 0, 60, 0, 0, 60, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.home'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.rentMortgage'),
                values: [1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600, 1600]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.propertyTaxes'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.insurance'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.car'),
                values: [0, 300, 0, 0, 300, 0, 0, 300, 0, 0, 300, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.health'),
                values: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.transportation'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.fuel'),
                values: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.supplies'),
                values: [0, 0, 300, 0, 0, 0, 0, 0, 0, 300, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.travel'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.airfare'),
                values: [0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.hotels'),
                values: [0, 0, 0, 0, 0, 500, 0, 0, 0, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.utilities'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.phone'),
                values: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.internet'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.electricity'),
                values: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.gas'),
                values: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.water'),
                values: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          }
        ],
        income: [
          {
            id: uuid(),
            name: t('feature.templates.demo.income.wages'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.income.paySlip'),
                values: [7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150, 7150]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.income.bonus'),
                values: [0, 0, 500, 0, 0, 0, 0, 1500, 0, 0, 0, 1000]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.income.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.income.other'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.income.interestIncome'),
                values: [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.income.dividends'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.income.other'),
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
            name: t('feature.templates.demo.income.wages'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.income.paySlip'),
                values: [8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.income.bonus'),
                values: [0, 0, 0, 0, 0, 0, 0, 2000, 0, 0, 0, 1000]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.income.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.income.other'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.income.interestIncome'),
                values: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.income.dividends'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.income.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          }
        ],
        expenses: [
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.children'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.activities'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.medical'),
                values: [20, 20, 200, 20, 20, 20, 200, 20, 20, 20, 200, 20]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.childcare'),
                values: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.debt'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.studentLoans'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.education'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.musicLessons'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.entertainment'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.concertsShows'),
                values: [0, 0, 0, 0, 600, 0, 0, 0, 0, 450, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.music'),
                values: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.theatrePlays'),
                values: [0, 60, 0, 0, 0, 0, 75, 0, 0, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.everyday'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.groceries'),
                values: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.restaurants'),
                values: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.personalSupplies'),
                values: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.subscriptions'),
                values: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.gifts'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.gifts'),
                values: [0, 0, 100, 0, 0, 0, 200, 0, 0, 0, 0, 400]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.donationsCharity'),
                values: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.healthMedical'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.doctorsDentalVision'),
                values: [0, 60, 0, 0, 60, 0, 0, 60, 0, 0, 60, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.home'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.rentMortgage'),
                values: [2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.propertyTaxes'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2000]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.insurance'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.car'),
                values: [0, 300, 0, 0, 300, 0, 0, 300, 0, 0, 300, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.health'),
                values: [200, 200, 200, 200, 200, 500, 500, 500, 500, 500, 500, 500]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.transportation'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.fuel'),
                values: [120, 120, 120, 120, 120, 140, 140, 140, 140, 140, 140, 140]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.supplies'),
                values: [0, 0, 300, 0, 0, 0, 0, 0, 0, 300, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.travel'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.airfare'),
                values: [1000, 0, 0, 0, 0, 1000, 0, 0, 1000, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.hotels'),
                values: [300, 0, 0, 0, 0, 500, 0, 0, 250, 0, 0, 0]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          },
          {
            id: uuid(),
            name: t('feature.templates.demo.expenses.utilities'),
            budgets: [
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.phone'),
                values: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.internet'),
                values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.electricity'),
                values: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.gas'),
                values: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.water'),
                values: [20, 20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25]
              },
              {
                id: uuid(),
                name: t('feature.templates.demo.budgets.other'),
                values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          }
        ]
      }
    ]
  };
};
