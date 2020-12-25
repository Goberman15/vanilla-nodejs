/**
 * create environment variables
 */

 const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';

 const environments = {};

 environments.development = {
    httpPort: 3000,
    httpsPort: 3030,
    envName: 'development'
 }

 environments.production = {
     httpPort: 8000,
     httpsPort: 8080,
     envName: 'production'
 }


 module.exports = environments[env] ? environments[env] : environments.development;