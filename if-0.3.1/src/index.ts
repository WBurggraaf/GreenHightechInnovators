import { aggregate } from './lib/aggregate';
import { compute } from './lib/compute';
import { outputText } from './lib/exhaust';
import { loadFromText } from './lib/load';
import { parameterize } from './lib/parameterize';
import { ERRORS } from './util/errors';
import { logger } from './util/logger';
import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json'; // Replace 'swagger.json' with your Swagger spec file path
import { STRINGS } from './config';
import { initalize } from './lib/initialize';
import yaml from 'js-yaml';

const packageJson = require('../package.json');

const { CliInputError } = ERRORS;

const { DISCLAIMER_MESSAGE, SOMETHING_WRONG } = STRINGS;

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Serve Swagger UI at /api-docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/if', (req: Request, res: Response) => {

  const yamlData = yaml.dump(req.body, { indent: 2 });

  impactEngineApi(yamlData)
    .then((value) => {
      const jsonValue = JSON.parse(value);
      res.json(jsonValue);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



async function impactEngineApi(inputText: string):Promise<string> {
  logger.info(DISCLAIMER_MESSAGE);

  if (inputText) {
    const {tree, context, parameters} = await loadFromText(inputText);
    parameterize.combine(context.params, parameters);
    const plugins = await initalize(context.initialize.plugins);
    const computedTree = await compute(tree, {context, plugins});
    const aggregatedTree = aggregate(computedTree, context.aggregation);
    context['if-version'] = packageJson.version;
    return Promise.resolve(outputText(aggregatedTree));
  }

  return Promise.reject(new CliInputError(SOMETHING_WRONG));
}

// const impactEngine = async () => {
//   logger.info(DISCLAIMER_MESSAGE);
//   const options = parseArgs();
//
//   if (options) {
//     const {inputPath, outputPath, paramPath} = options;
//
//     const {tree, context, parameters} = await load(inputPath, paramPath);
//     parameterize.combine(context.params, parameters);
//     const plugins = await initalize(context.initialize.plugins);
//     const computedTree = await compute(tree, {context, plugins});
//     const aggregatedTree = aggregate(computedTree, context.aggregation);
//     context['if-version'] = packageJson.version;
//     exhaust(aggregatedTree, context, outputPath);
//
//     return;
//   }
//
//   return Promise.reject(new CliInputError(SOMETHING_WRONG));
// };
//
// impactEngine().catch(andHandle);
