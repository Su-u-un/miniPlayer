const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  entry:'./src/index.ts',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename: "index.js"
  },
  resolve: {
    "extensions":['.ts','.js','.json']
  },
  devServer: {
    contentBase:'/dist',
    open:true
  },
  module:{
    rules: [
      {
        test: /\.css$/,
        use:['style-loader','css-loader'],
        exclude:[
          path.resolve(__dirname,'src/components')
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader',{
          loader:'css-loader',
          options:{
            modules:{
              localIdentName: "[path][name]__[local]--[hash:base64:5]",
            }
          }
        }],
        include:[
          path.resolve(__dirname,'src/components')
        ]
      },
      {
        test: /\.(eot|woff2|woff|ttf|svg)$/,
        use: ['file-loader']
      },
      {
        test:/\.ts$/,
        use:['ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin()
  ],
  mode:'development'
}
