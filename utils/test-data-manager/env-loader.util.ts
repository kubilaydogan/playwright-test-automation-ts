const env = process.env.ENV || 'qa1';    
const data = require(`../../test-data/environments/${env}.env.ts`).default;

export default data;