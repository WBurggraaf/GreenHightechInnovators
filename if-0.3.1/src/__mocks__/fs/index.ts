import * as YAML from 'js-yaml';

export const readFile = async (filePath: string, _format: string) => {
  /** mock for util/json */
  if (filePath.includes('json-reject')) {
    return Promise.reject(new Error('rejected'));
  }
  if (filePath.includes('json')) {
    return JSON.stringify(filePath);
  }

  /** mock for util/yaml */
  return `
  name: gsf-demo
  description: 
    Hello
  tags:
    kind: web
    complexity: moderate
    category: cloud
  initialize:
    models:
      boavizta-cpu:
  tree:
    children:
      front-end:
        pipeline: 
          - boavizta-cpu
        config:
          boavizta-cpu:
            core-units: 24
            processor: Intel® Core™ i7-1185G7
        inputs:
          - timestamp: 2023-07-06T00:00
            duration: 3600 # Secs
            cpu/utilization: 18.392
          - timestamp: 2023-08-06T00:00
            duration: 3600 # Secs
            cpu/utilization: 16`;
};

export const mkdir = (dirPath: string, _object: any) => dirPath;

export const writeFile = async (pathToFile: string, content: string) => {
  if (pathToFile === 'reject') {
    throw Error('Wrong file path');
  }

  const mockPathToFile = 'mock-pathToFile';
  const mockContent = {
    name: 'mock-name',
  };
  const mockObject = YAML.dump(mockContent, {noRefs: true});

  expect(pathToFile).toBe(mockPathToFile);
  expect(content).toBe(mockObject);
};
