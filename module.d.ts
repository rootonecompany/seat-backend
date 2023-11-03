declare namespace NodeJS {
  export interface ProcessEnv {
    PRISMA_MYSQL: string;
    JWT_SECRET_KEY: string;
    JWT_REFRESH_KEY: string;
  }
}
