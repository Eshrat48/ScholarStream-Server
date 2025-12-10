/**
 * Environment configuration helper
 * Validates and provides access to environment variables
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT',
  'CLIENT_URL',
];

const optionalEnvVars = [
  'STRIPE_SECRET_KEY',
  'NODE_ENV',
];

const validateEnvironment = () => {
  const missing = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file'
    );
  }

  console.log('✓ All required environment variables are set');
};

const getConfig = () => {
  validateEnvironment();

  return {
    mongodb: {
      uri: process.env.MONGODB_URI,
      dbName: 'scholarStreamDB',
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    },
    server: {
      port: process.env.PORT || 5000,
      env: process.env.NODE_ENV || 'development',
    },
    client: {
      url: process.env.CLIENT_URL,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
    },
  };
};

module.exports = {
  validateEnvironment,
  getConfig,
};
