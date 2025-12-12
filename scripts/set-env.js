const { writeFile } = require('fs');

// Cargar variables de entorno desde archivo .env si existe
require('dotenv').config();

const apiUrl = process.env.API_URL || 'http://localhost:3000/api';

// Parsear argumentos de la línea de comandos manualmente
const args = process.argv.slice(2);
const environmentArg = args.find(arg => arg.startsWith('--environment='));
const environment = environmentArg ? environmentArg.split('=')[1] : 'development';
const isProduction = environment === 'production';

const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

const envConfigFile = `export const environment = {
  production: ${isProduction},
  apiUrl: '${apiUrl}'
};
`;

writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(`✅ Environment file generated at ${targetPath}`);
    console.log(`   API_URL: ${apiUrl}`);
  }
});
