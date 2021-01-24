const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
console.log('IS DEV: ', isDev);
const isProd = !isDev;

const cssLoaders = (extra) => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				//hmr: isDev,
				//reloadAll: true,
				publicPath: (resourcePath, context) => {
					return path.relative(path.dirname(resourcePath), context) + '/';
				},
			},
		},
		'css-loader',
	];
	if (extra) {
		loaders.push(extra);
	}
	return loaders;
};

const useJs = (extra) => {
	const scripts = [
		{
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env'],
				plugins: ['@babel/plugin-proposal-class-properties'],
			},
		},
	];
	if (extra) {
		scripts[0].options.presets.push(extra);
	}
	return scripts;
};

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all',
		},
	};
	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetPlugin(),
			new TerserWebpackPlugin(),
		];
	}
	return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const plugins = () => {
	const base = [
		new HTMLWebpackPlugin({
			template: './index.html',
			minify: {
				collapseWhitespace: isProd,
			},
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/assets/favicon.ico'),
					to: path.resolve(__dirname, 'dist'),
				},
			],
		}),
		new MiniCssExtractPlugin({
			filename: filename('css'),
		}),
	];
	if (isProd) {
		base.push(new BundleAnalyzerPlugin());
	}
	return base;
};

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		main: ['@babel/polyfill', './index.jsx'],
		analytics: './analytics.ts',
	},
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist'),
	},

	optimization: optimization(),
	devServer: {
		port: 4200,
		open: isDev,
	},
	// TODO 23.01.2021 (GW)devtool: isDev ? 'source-map$' : 'nosources',

	plugins: plugins(),

	module: {
		rules: [
			{
				test: /\.css$/,
				use: cssLoaders(),
			},

			{
				test: /\.less$/,
				use: cssLoaders('less-loader'),
			},

			{
				test: /\.s[ac]ss$/,
				use: cssLoaders('sass-loader'),
			},

			{
				test: /\.(png|jpg|svg|gif)$/,
				use: ['file-loader'],
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
						},
					},
				],
			},
			{
				test: /\.xml$/,
				use: ['xml-loader'],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					plugins: ['@babel/plugin-proposal-class-properties'],
				},
			},
			// TODO 23.01.2021 (GW) sollte nur im dev stage eingeschaltet werden
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['eslint-loader'],
			},

			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: useJs('@babel/preset-typescript'),
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: useJs('@babel/preset-react'),
			},
		],
	},
	//if(isDev) {
	//	// only enable hot in development
	//	//module.plugins.push(new webpack.HotModuleReplacementPlugin());
	//},
};
