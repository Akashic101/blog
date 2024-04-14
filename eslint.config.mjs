import globals from 'globals';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
	{ languageOptions: { globals: globals.browser } },
	{
		plugins: {
			prettier: pluginPrettier,
		},
		rules: {
			'prettier/prettier': 'error',
		},
	},
];
