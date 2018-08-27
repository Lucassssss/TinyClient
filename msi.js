import { MSICreator } from 'electron-wix-msi';

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: './dist/win-unpacked',
  description: 'TinyClient',
  exe: 'TinyClient',
  name: 'TinyClient',
  manufacturer: 'Lucas',
  version: '1.0.1',
  outputDirectory: './msi'
});

// Step 2: Create a .wxs template file
await msiCreator.create();

// Step 3: Compile the template to a .msi file
await msiCreator.compile();