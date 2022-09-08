import { createLogger } from '@utils';

const logger = createLogger('analytics');
const { ACKEE_HOST, ACKEE_DOMAIN_ID, PROD } = import.meta.env;

if (PROD) {
  if (ACKEE_HOST && ACKEE_DOMAIN_ID) {
    import('ackee-tracker').then(({ create }) => {
      logger.success("Enabled, don't worry - it's self-hosted and just for me :)");
      create(ACKEE_HOST).record(ACKEE_DOMAIN_ID);
    });
  } else {
    logger.info('Disabled (not configured)');
  }
}
