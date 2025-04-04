/* eslint-disable @typescript-eslint/no-floating-promises */

import * as nodePath from 'node:path';
import assert from 'node:assert/strict';
import { describe, it, beforeEach, mock } from 'node:test';

import { validateFilenames } from '../src/validate-filenames';

const TEST_CONFIGS = {
  anyCharacter: { path: '05-contains-a-files', pattern: '^.+$' },
  nameDotExtension: {
    path: '02-name-dot-extension-files',
    pattern: '^.+\\..+$',
  },
  dotFile: { path: '03-dot-files', pattern: '^\\..+$' },
  noDot: { path: '04-no-dot-files', pattern: '^[^\\.].+$' },
  containsA: { path: '05-contains-a-files', pattern: 'a+' },
  json: { path: '06-json-files', pattern: '\\.json$' },
  includeFolders: {
    path: '07-include-folders',
    pattern: '^[a-z0-9]+(-[a-z0-9]+)*$',
  },
};

beforeEach(() => {
  // We silence the console for better readability in tests
  mock.method(console, 'log', () => {});
});

describe('validateFilenames function', () => {
  it('01 - Passes for any character files', async () => {
    const testConfig = TEST_CONFIGS.anyCharacter;
    const dirPath =
      nodePath.join(__dirname, 'test-files', testConfig.path) + '/*';
    const pattern = new RegExp(testConfig.pattern);
    const expected = { totalFilesAnalyzed: 5, failedFiles: [] };

    const result = await validateFilenames(dirPath, pattern);
    assert.deepStrictEqual(result, expected);
  });

  it('02 - Passes for `name.ext` files', async () => {
    const testConfig = TEST_CONFIGS.nameDotExtension;
    const dirPath =
      nodePath.join(__dirname, 'test-files', testConfig.path) + '/*';
    const pattern = new RegExp(testConfig.pattern);
    const expected = { totalFilesAnalyzed: 1, failedFiles: [] };

    const result = await validateFilenames(dirPath, pattern);
    assert.deepStrictEqual(result, expected);
  });

  it('03 - Passes for `.dotfiles`', async () => {
    const testConfig = TEST_CONFIGS.dotFile;
    const dirPath =
      nodePath.join(__dirname, 'test-files', testConfig.path) + '/.*';
    const pattern = new RegExp(testConfig.pattern);
    const expected = { totalFilesAnalyzed: 1, failedFiles: [] };

    const result = await validateFilenames(dirPath, pattern);
    assert.deepStrictEqual(result, expected);
  });

  it('04 - Passes for no `.dotfiles`', async () => {
    const testConfig = TEST_CONFIGS.noDot;
    const dirPath =
      nodePath.join(__dirname, 'test-files', testConfig.path) + '/*';
    const pattern = new RegExp(testConfig.pattern);
    const expected = { totalFilesAnalyzed: 5, failedFiles: [] };

    const result = await validateFilenames(dirPath, pattern);
    assert.deepStrictEqual(result, expected);
  });

  it('05 - Passes for files with `a` in the name', async () => {
    const testConfig = TEST_CONFIGS.containsA;
    const dirPath =
      nodePath.join(__dirname, 'test-files', testConfig.path) + '/*';
    const pattern = new RegExp(testConfig.pattern);
    const expected = { totalFilesAnalyzed: 5, failedFiles: [] };

    const result = await validateFilenames(dirPath, pattern);
    assert.deepStrictEqual(result, expected);
  });

  it('06 - Passes for json files `*.json`', async () => {
    const testConfig = TEST_CONFIGS.json;
    const dirPath =
      nodePath.join(__dirname, 'test-files', testConfig.path) + '/*';
    const pattern = new RegExp(testConfig.pattern);
    const expected = { totalFilesAnalyzed: 5, failedFiles: [] };

    const result = await validateFilenames(dirPath, pattern);
    assert.deepStrictEqual(result, expected);
  });

  it('07 - Passes for folders', async () => {
    const testConfig = TEST_CONFIGS.includeFolders;
    const dirPath =
      nodePath.join(__dirname, 'test-files', testConfig.path) + '/**';
    const pattern = new RegExp(testConfig.pattern);
    const expected = { totalFilesAnalyzed: 6, failedFiles: [] };

    const result = await validateFilenames(dirPath, pattern);
    assert.deepStrictEqual(result, expected);
  });
});
