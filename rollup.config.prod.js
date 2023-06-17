import ts from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import path from 'path'

const mode = process.env.MODE;
const isProd = mode === 'prod';

export default {
  input: `../index.ts`,
  output: [
    {
      file: "./dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "./dist/index.esm.js",
      format: "esm",
    },
    {
      file: "./dist/index.umd.js",
      format: "umd",
    },
  ],
  plugins: [
    nodeResolve({
      extensions:['.js', '.ts']
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    serve({
      port: 3000,
      contentBase:'', // 表示起的服务是在根目录下
      openPage: '/public/index.html' , // 打开的是哪个文件
      open: true // 默认打开浏览器
    })
  ],
};
