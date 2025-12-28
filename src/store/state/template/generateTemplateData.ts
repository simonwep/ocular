import { DataState } from '../types';
import { generateBudgetGroup } from '@store/state/utils/generators.ts';
import { useI18n } from 'vue-i18n';

// Module is dynamically loaded so injected composables cannot be used here directly.
export const generate = (
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
        year,
        expenses: [
          generateBudgetGroup(t('feature.templates.base.group.children'), [
            t('feature.templates.base.category.activities'),
            t('feature.templates.base.category.medical'),
            t('feature.templates.base.category.childcare'),
            t('feature.templates.base.category.clothing'),
            t('feature.templates.base.category.school'),
            t('feature.templates.base.category.toys'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.debt'), [
            t('feature.templates.base.category.creditCards'),
            t('feature.templates.base.category.studentLoans'),
            t('feature.templates.base.category.otherLoans'),
            t('feature.templates.base.category.taxes'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.education'), [
            t('feature.templates.base.category.tuition'),
            t('feature.templates.base.category.books'),
            t('feature.templates.base.category.musicLessons'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.entertainment'), [
            t('feature.templates.base.category.books'),
            t('feature.templates.base.category.concertsShows'),
            t('feature.templates.base.category.games'),
            t('feature.templates.base.category.hobbies'),
            t('feature.templates.base.category.films'),
            t('feature.templates.base.category.music'),
            t('feature.templates.base.category.outdoorActivities'),
            t('feature.templates.base.category.photography'),
            t('feature.templates.base.category.sport'),
            t('feature.templates.base.category.theatrePlays'),
            t('feature.templates.base.category.tv'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.everyday'), [
            t('feature.templates.base.category.groceries'),
            t('feature.templates.base.category.restaurants'),
            t('feature.templates.base.category.personalSupplies'),
            t('feature.templates.base.category.clothes'),
            t('feature.templates.base.category.laundryDryCleaning'),
            t('feature.templates.base.category.hairBeauty'),
            t('feature.templates.base.category.subscriptions'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.gifts'), [
            t('feature.templates.base.category.gifts'),
            t('feature.templates.base.category.donationsCharity'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.healthMedical'), [
            t('feature.templates.base.category.doctorsDentalVision'),
            t('feature.templates.base.category.specialistCare'),
            t('feature.templates.base.category.pharmacy'),
            t('feature.templates.base.category.emergency'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.home'), [
            t('feature.templates.base.category.rentMortgage'),
            t('feature.templates.base.category.propertyTaxes'),
            t('feature.templates.base.category.furnishings'),
            t('feature.templates.base.category.lawnGarden'),
            t('feature.templates.base.category.supplies'),
            t('feature.templates.base.category.maintenance'),
            t('feature.templates.base.category.improvements'),
            t('feature.templates.base.category.moving'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.insurance'), [
            t('feature.templates.base.category.car'),
            t('feature.templates.base.category.health'),
            t('feature.templates.base.category.homeInsurance'),
            t('feature.templates.base.category.life'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.pets'), [
            t('feature.templates.base.category.food'),
            t('feature.templates.base.category.vetMedical'),
            t('feature.templates.base.category.toys'),
            t('feature.templates.base.category.supplies'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.technology'), [
            t('feature.templates.base.category.domainsAndHosting'),
            t('feature.templates.base.category.onlineServices'),
            t('feature.templates.base.category.hardware'),
            t('feature.templates.base.category.software'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.transportation'), [
            t('feature.templates.base.category.fuel'),
            t('feature.templates.base.category.carPayments'),
            t('feature.templates.base.category.repairs'),
            t('feature.templates.base.category.registrationLicense'),
            t('feature.templates.base.category.supplies'),
            t('feature.templates.base.category.publicTransit'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.travel'), [
            t('feature.templates.base.category.airfare'),
            t('feature.templates.base.category.hotels'),
            t('feature.templates.base.category.food'),
            t('feature.templates.base.category.transportation'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.utilities'), [
            t('feature.templates.base.category.phone'),
            t('feature.templates.base.category.tv'),
            t('feature.templates.base.category.internet'),
            t('feature.templates.base.category.electricity'),
            t('feature.templates.base.category.heatGas'),
            t('feature.templates.base.category.water'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.other'), [
            t('feature.templates.base.category.category1'),
            t('feature.templates.base.category.category2')
          ])
        ],
        income: [
          generateBudgetGroup(t('feature.templates.base.group.wages'), [
            t('feature.templates.base.category.paySlip'),
            t('feature.templates.base.category.tips'),
            t('feature.templates.base.category.bonus'),
            t('feature.templates.base.category.commission'),
            t('feature.templates.base.category.other')
          ]),
          generateBudgetGroup(t('feature.templates.base.group.other'), [
            t('feature.templates.base.category.transferFromSavings'),
            t('feature.templates.base.category.interestIncome'),
            t('feature.templates.base.category.dividends'),
            t('feature.templates.base.category.gifts'),
            t('feature.templates.base.category.refunds'),
            t('feature.templates.base.category.other')
          ])
        ]
      }
    ]
  };
};
