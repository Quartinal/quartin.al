import { basename, join, resolve, dirname } from "path";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";

const require = createRequire(import.meta.url);
const HtmlInlineCssWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STATIC_DIR = resolve(__dirname, "static");
const DIST_DIR = resolve(__dirname, "dist");

const htmlFiles = readdirSync(STATIC_DIR).filter(f => f.endsWith(".html"));

const entries = Object.fromEntries(
  htmlFiles.map(file => {
    const name = basename(file, ".html");
    const jsPath = join(STATIC_DIR, "scripts", `${name}.js`);
    const cssPath = join(STATIC_DIR, "styles", `${name}.css`);
    const entryArray = [];
    try { require.resolve(jsPath); entryArray.push(jsPath); } catch {}
    try { require.resolve(cssPath); entryArray.push(cssPath); } catch {}
    return [name, entryArray];
  })
);

// Custom plugin to inject Plausible analytics
class InjectPlausiblePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('InjectPlausiblePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InjectPlausiblePlugin',
        (data, cb) => {
          const plausibleScript = `<!-- Privacy-friendly analytics by Plausible --><script async src="https://analytics.quartinal.click/js/pa-rxuXeIY_4Td5Jfdma2d0_.js"></script><script>window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()</script>`;
          
          // Inject before closing </head> tag
          data.html = data.html.replace('</head>', `${plausibleScript}</head>`);
          
          cb(null, data);
        }
      );
    });
  }
}

export default {
  mode: "production",
  entry: entries,
  output: {
    path: DIST_DIR,
    filename: "[name].js",
    clean: true
  },
  resolve: {
    alias: {
      "/scripts": resolve(__dirname, "static/scripts"),
      "/styles": resolve(__dirname, "static/styles"),
      "/assets/images": resolve(__dirname, "static/assets/images")
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset"
      },
      {
        test: /\.html$/i,
        loader: "html-loader"
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                { plugins: [{ name: "preset-default" }, { name: "addAttributesToSVGElement", params: { attributes: [{ xmlns: "http://www.w3.org/2000/svg" }] } }] }
              ]
            ]
          }
        }
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    ...htmlFiles.map(file => {
      const name = basename(file, ".html");
      return new HtmlWebpackPlugin({
        template: join(STATIC_DIR, file),
        filename: file,
        chunks: [name],
        inject: "body"
      });
    }),
    new HtmlInlineCssWebpackPlugin(),
    new InjectPlausiblePlugin()
  ]
};