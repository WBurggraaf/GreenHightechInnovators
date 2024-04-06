import {Context} from '../types/manifest';

export const ExportLog = () => {
  /**
   * Logs output manifest in console.
   */
  const execute = async (tree: any, context: Context) => {
    const outputFile = {
      ...context,
      tree,
    };

    console.log(JSON.stringify(outputFile, null, 2));
  };

  return {execute};
};
