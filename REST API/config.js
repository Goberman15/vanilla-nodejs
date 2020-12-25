/**
 * create environment variables
 */

 const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';

 const environments = {};

 environments.development = {
    port: 3000,
    envName: 'development'
 }

 environments.production = {
     port: 8000,
     envName: 'production'
 }


 module.exports = environments[env] ? environments[env] : environments.development;