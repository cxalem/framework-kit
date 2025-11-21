import { basename } from 'node:path';
import { defineConfig } from 'tsup';

const packageDirName = basename(process.cwd());
const external: string[] = [];
const tsconfigPath = packageDirName === 'react-hooks' ? 'tsconfig.bundle.json' : 'tsconfig.json';

if (packageDirName === 'react-hooks') {
	external.push('@solana/client');
}

const baseEntry = ['src/index.ts'];
const nodeEntry = packageDirName === 'client' ? [...baseEntry, 'src/server/index.ts'] : baseEntry;
const browserEntry = baseEntry;
const neutralEntry = baseEntry;

const common = {
	clean: true,
	dts: false,
	entry: nodeEntry,
	keepNames: true,
	minify: false,
	shims: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	splitting: false,
	target: 'es2022',
	treeshake: true,
	tsconfig: tsconfigPath,
	external,
} as const;

export default defineConfig([
	{
		...common,
		entry: nodeEntry,
		format: ['esm', 'cjs'],
		outDir: 'dist',
		outExtension({ format }) {
			return {
				js: format === 'esm' ? '.node.mjs' : '.node.cjs',
			};
		},
		platform: 'node',
	},
	{
		...common,
		entry: browserEntry,
		format: ['esm', 'cjs'],
		outDir: 'dist',
		outExtension({ format }) {
			return {
				js: format === 'esm' ? '.browser.mjs' : '.browser.cjs',
			};
		},
		platform: 'browser',
	},
	{
		...common,
		entry: neutralEntry,
		format: ['esm'],
		outDir: 'dist',
		outExtension() {
			return { js: '.native.mjs' };
		},
		platform: 'neutral',
	},
]);
