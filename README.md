# react-ts-starter  
`yarn(npm) start` to run  
  
**Features**  
* ~~`webpack.config` written in ts~~ It now uses [Parcel](https://parceljs.org/)
* ~~tree-shaking support (all without having to use babel)~~ Tree-shaking, etc. all handled by Parcel and so isn't really a concern
* no `JSX` (or `TSX`). All pure ts with `react-dom-factories`. Controversial choice, but it does result in simplier (albeit arguably less semantic) code.
* ~~`tsconfig` uses `paths` to make import paths look nicer~~
  * ~~webpack > resolve > alias should inform webpack what these mean (not fully tested yet)~~ (pending)
  
**Notes**
* `tsconfig` may have extraneous items (libs for example)
* ~~`tsconfig.webpack.json` is what webpack will transpile ts into~~
  1. ~~it receives the es5 code with es6 modules so it can tree-shake...~~
  2. ~~then it transpiles again to es5 and commonjs modules for the browser~~
* `tslint` is a tad opinionated and can be modified per liking
* You'll need to export env var `TS_NODE_PROJECT=tsconfig.webpack.json`
