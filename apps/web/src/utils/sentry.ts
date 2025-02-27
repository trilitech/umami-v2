import * as Sentry from "@sentry/react";

import { IS_DEV, SENTRY_DSN_KEY } from "../env";

Sentry.init({
  dsn: SENTRY_DSN_KEY,
  enabled: !IS_DEV,
  integrations: [Sentry.httpClientIntegration()],
});
