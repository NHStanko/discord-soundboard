import { ConfigInterface } from './config_interface';
require('dotenv').config();

//Creating Config
const config: ConfigInterface = require('../../../config/config.json');
// Loop through enviroment variables and overwrite config values
for(const key in config){
    if(Object.getOwnPropertyDescriptor(process.env, key)){
        config[key] = process.env[key];
    }
}

export { config };