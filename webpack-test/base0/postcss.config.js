// module.exports = {  
//   plugins: {  
//     'autoprefixer': {browsers: 'last 5 version'}  
//   }  
// } 
module.exports = {
  loader: 'postcss-loader',  
  plugins: {
      'postcss-preset-env': {},
    }
}