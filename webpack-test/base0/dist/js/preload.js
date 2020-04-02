(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["preload"],{

/***/ "./test/other/preload.js":
/*!*******************************!*\
  !*** ./test/other/preload.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// 操作 DOM 元素，把 content 显示到网页上\nfunction preload(content) {\n  window.document.getElementById('app').innerText = 'Hello,' + content;\n} // 通过 CommonJS 规范导出 show 函数\n\n\nmodule.exports = preload;\n\n//# sourceURL=webpack:///./test/other/preload.js?");

/***/ })

}]);