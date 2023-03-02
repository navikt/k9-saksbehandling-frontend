const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const commonWebpackConfig = require('./webpack.common.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const mockLogin = require('./mocks/mockLogin');
const mockSentry = require('./mocks/mockSentry');
const mockOverføringer = require('./mocks/mockOverforinger');
const mockKoronaoverføringer = require('./mocks/mockKoronaoverforinger');
const mockPersonsøk = require('./mocks/mockPersonsok');
const mockFordelinger = require('./mocks/mockFordelinger');
const mockBarn = require('./mocks/mockBarn');
const mockKvote = require('./mocks/mockKvote');
const mockDokumenter = require('./mocks/mockDokumenter');
const mockUidentifiserteRammemeldinger = require("./mocks/mockUidentifiserteRammemeldinger");
// webpack.config.js

process.env.NODE_ENV = 'development';
const dotenv = require("dotenv").config({ path: __dirname + "/../.env.local" });

const webpackConfig = merge(commonWebpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
    }),
  ],
  resolve: {
    modules: ['node_modules', 'src'],
  },

});

const port = 3000;
const devServerOptions = {
  hot: true,
  port,
    onBeforeSetupMiddleware: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.get('/localapi/env', (req, res) => {
        return res.status(200).json({ });
      });

      mockLogin(devServer.app);
      mockSentry(devServer.app);
      mockOverføringer(devServer.app);
      mockKoronaoverføringer(devServer.app);
      mockPersonsøk(devServer.app);
      mockFordelinger(devServer.app);
      mockBarn(devServer.app);
      mockKvote(devServer.app);
      mockDokumenter(devServer.app);
      mockUidentifiserteRammemeldinger(devServer.app);

      devServer.app.get('/hi', function (req, res) {
        res.json({ custom: 'response' });
      });
    },
};

const compiler = webpack(webpackConfig);
const devServer = new WebpackDevServer(devServerOptions, compiler);
compiler.close(() => console.info('Compiler closed'));

devServer.startCallback((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Listening at port ${port}`);
  }
});