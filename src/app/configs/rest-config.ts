import { baseURL } from '../constants/baseurl';

// Function for settting the default restangular configuration
export function RestangularConfigFactory (RestangularProvider) {
  RestangularProvider.setBaseUrl(baseURL);
  RestangularProvider.setRestangularFields({
    id: "Id"
  });
}