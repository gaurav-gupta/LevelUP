import * as devlopmentConfig from "./development_config";
import * as productionConfig from "./production_config";
import * as testConfig from "./test_config";

let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
let config;

let envObject = {
	"development": devlopmentConfig,
	"production": productionConfig,
	"test": testConfig
}

config = envObject[env];

export = config;
