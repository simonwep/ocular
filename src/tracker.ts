import { createLogger } from '@utils';

const logger = createLogger('analytics');
const { OCULAR_ACKEE_HOST, OCULAR_ACKEE_DOMAIN_ID, PROD } = import.meta.env;

if (PROD) {
  if (OCULAR_ACKEE_HOST && OCULAR_ACKEE_DOMAIN_ID) {
    import('ackee-tracker').then(({ create }) => {
      logger.success("Enabled, don't worry - it's self-hosted and just for me :)");
      create(OCULAR_ACKEE_HOST).record(OCULAR_ACKEE_DOMAIN_ID);
    });
  } else {
    logger.info('Disabled (not configured)');
  }
}
