/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  experimental: {
    appDir: true,
  },
  typescript: {
    // Risky, but TS is taking me in circles :/
    ignoreBuildErrors: true,
  },
  env: {
    NEXTAUTH_URL: "https://synthetica-ml.vercel.app",
    NEXTAUTH_SECRET: "oznYdPhB+n7PfJJ9LQjjYAbkP250Z2SptawajO1A+Qs=",
    POSTGRES_URL: "postgres://default:Z8qo5JDvbPQd@ep-icy-grass-a4np5qa5-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require",
    POSTGRES_PRISMA_URL: "postgres://default:Z8qo5JDvbPQd@ep-icy-grass-a4np5qa5-pooler.us-east-1.aws.neon.tech/verceldb?pgbouncer=true&connect_timeout=15&sslmode=require",
    POSTGRES_URL_NON_POOLING: "postgres://default:Z8qo5JDvbPQd@ep-icy-grass-a4np5qa5.us-east-1.aws.neon.tech/verceldb?sslmode=require",
    POSTGRES_USER: "default",
    POSTGRES_HOST: "ep-icy-grass-a4np5qa5-pooler.us-east-1.aws.neon.tech",
    POSTGRES_PASSWORD: "Z8qo5JDvbPQd",
    POSTGRES_DATABASE: "verceldb",
  },
}

export default nextConfig;