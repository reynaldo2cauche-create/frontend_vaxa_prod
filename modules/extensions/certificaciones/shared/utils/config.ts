import { TENANT_CONFIG } from '../constants';

/**
 * Convierte la config del tenant a formato compatible con el Header global
 */
export const getHeaderConfig = () => ({
  logo: TENANT_CONFIG.LOGO,
  name: TENANT_CONFIG.NAME,
  primaryColor: TENANT_CONFIG.PRIMARY_COLOR,
  secondaryColor: TENANT_CONFIG.SECONDARY_COLOR
});
