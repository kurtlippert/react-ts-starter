# react-ts-starter  
`yarn(npm) start` to run  
`yarn(npm) build` to build  
  
**Features**  
* Uses [Parcel](https://parceljs.org/) for all things bundle related
* no `JSX` (or `TSX`). All pure ts with `react-dom-factories`. Controversial choice, but it does result in simplier (albeit arguably less semantic) code.  
  
**Notes**
* `tsconfig` may have extraneous items (libs for example)
* `tslint` is a tad opinionated and can be modified per liking
* You'll need to export env var `TS_NODE_PROJECT=tsconfig.webpack.json`
