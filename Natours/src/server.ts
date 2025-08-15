import app from "./app";
import { envConfig } from "./env";
import { logger } from "./utils/logger";

const mainEntryApp = app;

mainEntryApp.listen(envConfig.APP_PORT, () => {
  logger.info('Listening on port', envConfig.APP_PORT);
});
