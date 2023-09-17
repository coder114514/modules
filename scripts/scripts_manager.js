/**
 * Due to the increasing complexity of the module build system, we have yet more code here
 * to manage the build scripts.
 * 
 * The build scripts are configured to be compiled down to a single file upon initialization
 * of the workspace. If the `scripts/bin.js` file isn't present, then run `yarn scripts:build`
 * to have it built.
 */

import { context as esbuild } from 'esbuild'
import { ESLint } from 'eslint';
import chalk from 'chalk';
import { Command } from "commander";
import { readFile } from 'fs/promises';
import jest from 'jest'
import pathlib from 'path';
import ts from 'typescript'

const waitForQuit = () => new Promise((resolve, reject) => {
  process.stdin.setRawMode(true);
  process.stdin.on('data', (data) => {
    const byteArray = [...data];
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C');
      process.stdin.setRawMode(false);
      resolve();
    }
  });
  process.stdin.on('error', reject);
});

async function runTypecheck() {
  const parseDiagnostics = (diagnostics) => {
    const diagStr = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getNewLine: () => '\n',
      getCurrentDirectory: () => pathlib.resolve('.'),
      getCanonicalFileName: (name) => pathlib.basename(name),
    });

    console.log(diagStr)
  }

  // Step 1: Read the text from tsconfig.json
  const tsconfigLocation = './scripts/src/tsconfig.json'
  const configText = await readFile(tsconfigLocation, 'utf-8');

  // Step 2: Parse the raw text into a json object
  const { error: configJsonError, config: configJson } = ts.parseConfigFileTextToJson(tsconfigLocation, configText);
  if (configJsonError) {
    parseDiagnostics([configJsonError])
    return -1;
  }

  // Step 3: Parse the json object into a config object for use by tsc
  const { errors: parseErrors, options: tsconfig } = ts.parseJsonConfigFileContent(configJson, ts.sys, './scripts/src');
  if (parseErrors.length > 0) {
    parseDiagnostics(parseErrors)
    return -1;
  }

  const tscProgram = ts.createProgram(['./scripts/src/index.ts'], tsconfig)

  // Run tsc over the script source files
  const results = tscProgram.emit()
  const diagnostics = ts.getPreEmitDiagnostics(tscProgram)
    .concat(results.diagnostics);

  if (diagnostics.length > 0) {
    parseDiagnostics(diagnostics)
    return -1
  }
  return 0
}

const typeCheckCommand = new Command('typecheck')
  .description('Run tsc for test files')
  .action(runTypecheck)

function runJest(patterns, args) {
  // Convert windows style paths to posix paths
  // Jest doesn't like windows style paths
  const jestArgs = patterns === null ? null : patterns.map(pattern => pattern.split(pathlib.sep).join(pathlib.posix.sep))

  Object.entries(args).forEach(([name, value]) => {
    if (value) jestArgs.push(`--${name}`);
  })

  return jest.run(jestArgs, './scripts/src/jest.config.js')
}

const testCommand = new Command('test')
  .description('Run tests for script files')
  .argument('[patterns...]', 'Run tests matching the given patterns', null)
  .allowUnknownOption()
  .action(runJest)

async function runEsbuild({ watch }) {
  const buildContext = await esbuild({
    bundle: true,
    entryPoints: ['./scripts/src/index.ts'],
    format: 'esm',
    logLevel: 'warning',
    minify: true,
    outfile: './scripts/bin.js',
    packages: 'external',
    platform: 'node',
    tsconfig: './scripts/src/tsconfig.json',
  })

  if (watch) {
    await buildContext.watch()
    console.log('Launched esbuild in watch mode')
    await waitForQuit()
  } else {
    await buildContext.rebuild()
  }
  await buildContext.dispose()
}

const buildCommand = new Command('build')
  .description('Run esbuild to compile the script source files')
  .option('-w, --watch', 'Enable watch mode', false)
  .action(runEsbuild)

async function runEslint({ fix }) {
  const linter = new ESLint({
    cwd: pathlib.resolve('./scripts/src'),
    fix, 
  });

  const lintResults = await linter.lintFiles('./**/*.ts')

  if (fix) {
    await ESLint.outputFixes(lintResults)
  }

  const outputFormatter = await linter.loadFormatter('stylish');
  const formatterOutput = outputFormatter.format(lintResults);

  console.log(formatterOutput)

  for (const { errorCount, warningCount } of lintResults) {
    if (errorCount > 0 || warningCount > 0) return -1;
  }
  return 0;
}

const lintCommand = new Command('lint')
  .description('Run eslint over the script source files')
  .option('--fix', 'Fix automatically fixable errors', false)
  .action(runEslint)

const mainCommand = new Command()
  .description('Commands for managing scripts')
  .addCommand(buildCommand)
  .addCommand(lintCommand)
  .addCommand(testCommand)
  .addCommand(typeCheckCommand)
  .action(async () => {
    const tasks = {
      // Jest will also run tsc, so no need to run an extra tsc check
      // typecheck: runTypecheck,
      eslint: () => runEslint({ fix: false }),
      jest: runJest,
      esbuild: () => runEsbuild({ watch: false })
    }

    // Perhaps there might be a better way to parallelize this?
    for (const [name, func] of Object.entries(tasks)) {
      console.log(chalk.blueBright(`Running ${name}`))
      if (await func() === -1) return -1;
    }

    console.log(chalk.greenBright('All commands completed successfully'))

    return 0;
  })

await mainCommand.parseAsync()
