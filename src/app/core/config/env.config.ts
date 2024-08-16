export const ENV_Config = () => ({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  GCS_FILE_BUCKET: process.env.GCS_FILE_BUCKET,
  GC_PROJECT_ID: process.env.GC_PROJECT_ID,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
