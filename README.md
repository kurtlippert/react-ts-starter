# react-ts-starter  
**Install nodejs**  
Install NodeJS as per your system  
`brew install node`  
`choco install node`  
`sudo (apt|dnf|etc.) install (node|nodejs|etc.)`

**Install yarn or npm**  
`brew install (npm|yarn)`  
...  
etc.

**Install parcel-bundler through npm/yarn**  
`npm install -g parcel-bundler`  
`yarn global add parcel-bundler`  

**Running the app**  
`yarn(npm) start` to run  
`yarn(npm) build` to build  
  
**Features**  
* Uses [Parcel](https://parceljs.org/) for all things bundle related
* no `JSX` (or `TSX`). All pure ts with `react-dom-factories`. Controversial choice, but it does result in simplier (albeit arguably less semantic) code.  
  
**Notes**
* `tsconfig` may have extraneous items (libs for example)
* `tslint` is a tad opinionated and can be modified per liking
