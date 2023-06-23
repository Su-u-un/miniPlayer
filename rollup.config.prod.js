import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2';
import babel from "rollup-plugin-babel";
// import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: `./src/index.ts`,
  output: [
    {
      file: "./dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "./dist/index.esm.js",
      format: "es",
    },
    {
      file: "./dist/index.umd.js",
      format: "umd",
      name: "Player",
    }
  ],
  plugins: [
    ts(),
    commonjs(),
    nodeResolve({
      browser:true
    }),
    babel(),
    //打包css
    postcss({
      plugins:[
        //压缩css
        cssnano()
      ],
      extract:'css/index.css'
    }),
    
  ],
  
};
