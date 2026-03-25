"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/combine-errors";
exports.ids = ["vendor-chunks/combine-errors"];
exports.modules = {

/***/ "(ssr)/./node_modules/combine-errors/index.js":
/*!**********************************************!*\
  !*** ./node_modules/combine-errors/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\n/**\n * Module Dependencies\n */\n\nvar Custom = __webpack_require__(/*! custom-error-instance */ \"(ssr)/./node_modules/custom-error-instance/index.js\")\nvar uniq = __webpack_require__(/*! lodash.uniqby */ \"(ssr)/./node_modules/lodash.uniqby/index.js\")\n\n/**\n * Use a custom error type\n */\n\nvar MultiError = Custom('MultiError')\n\n/**\n * Export `Error`\n */\n\nmodule.exports = error\n\n/**\n * Initialize an error\n */\n\nfunction error (errors) {\n  if (!(this instanceof error)) return new error(errors)\n  errors = Array.isArray(errors) ? errors : [ errors ]\n  errors = uniq(errors, function (err) { return err.stack })\n  if (errors.length === 1) return errors[0]\n  var multierror = new MultiError({\n    message: errors.map(function (err) { return err.message }).join('; '),\n    errors: errors.reduce(function (errs, err) { return errs.concat(err.errors || err) }, []),\n  })\n\n  // lazily get/set the stack\n  multierror.__defineGetter__('stack', function() {\n    return errors.map(function (err) { return err.stack }).join('\\n\\n')\n  })\n\n  multierror.__defineSetter__('stack', function(value) {\n    return [value].concat(multierror.stack).join('\\n\\n')\n  })\n\n  return multierror\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvY29tYmluZS1lcnJvcnMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQVk7O0FBRVo7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxrRkFBdUI7QUFDNUMsV0FBVyxtQkFBTyxDQUFDLGtFQUFlOztBQUVsQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsa0JBQWtCO0FBQzNEO0FBQ0E7QUFDQSx5Q0FBeUMsb0JBQW9CLFVBQVU7QUFDdkUsaURBQWlELHVDQUF1QztBQUN4RixHQUFHOztBQUVIO0FBQ0E7QUFDQSx1Q0FBdUMsa0JBQWtCO0FBQ3pELEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlZGRpbmctcG9ydGFsLy4vbm9kZV9tb2R1bGVzL2NvbWJpbmUtZXJyb3JzL2luZGV4LmpzPzk5NTMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogTW9kdWxlIERlcGVuZGVuY2llc1xuICovXG5cbnZhciBDdXN0b20gPSByZXF1aXJlKCdjdXN0b20tZXJyb3ItaW5zdGFuY2UnKVxudmFyIHVuaXEgPSByZXF1aXJlKCdsb2Rhc2gudW5pcWJ5JylcblxuLyoqXG4gKiBVc2UgYSBjdXN0b20gZXJyb3IgdHlwZVxuICovXG5cbnZhciBNdWx0aUVycm9yID0gQ3VzdG9tKCdNdWx0aUVycm9yJylcblxuLyoqXG4gKiBFeHBvcnQgYEVycm9yYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZXJyb3JcblxuLyoqXG4gKiBJbml0aWFsaXplIGFuIGVycm9yXG4gKi9cblxuZnVuY3Rpb24gZXJyb3IgKGVycm9ycykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgZXJyb3IpKSByZXR1cm4gbmV3IGVycm9yKGVycm9ycylcbiAgZXJyb3JzID0gQXJyYXkuaXNBcnJheShlcnJvcnMpID8gZXJyb3JzIDogWyBlcnJvcnMgXVxuICBlcnJvcnMgPSB1bmlxKGVycm9ycywgZnVuY3Rpb24gKGVycikgeyByZXR1cm4gZXJyLnN0YWNrIH0pXG4gIGlmIChlcnJvcnMubGVuZ3RoID09PSAxKSByZXR1cm4gZXJyb3JzWzBdXG4gIHZhciBtdWx0aWVycm9yID0gbmV3IE11bHRpRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IGVycm9ycy5tYXAoZnVuY3Rpb24gKGVycikgeyByZXR1cm4gZXJyLm1lc3NhZ2UgfSkuam9pbignOyAnKSxcbiAgICBlcnJvcnM6IGVycm9ycy5yZWR1Y2UoZnVuY3Rpb24gKGVycnMsIGVycikgeyByZXR1cm4gZXJycy5jb25jYXQoZXJyLmVycm9ycyB8fCBlcnIpIH0sIFtdKSxcbiAgfSlcblxuICAvLyBsYXppbHkgZ2V0L3NldCB0aGUgc3RhY2tcbiAgbXVsdGllcnJvci5fX2RlZmluZUdldHRlcl9fKCdzdGFjaycsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIGVyci5zdGFjayB9KS5qb2luKCdcXG5cXG4nKVxuICB9KVxuXG4gIG11bHRpZXJyb3IuX19kZWZpbmVTZXR0ZXJfXygnc3RhY2snLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBbdmFsdWVdLmNvbmNhdChtdWx0aWVycm9yLnN0YWNrKS5qb2luKCdcXG5cXG4nKVxuICB9KVxuXG4gIHJldHVybiBtdWx0aWVycm9yXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/combine-errors/index.js\n");

/***/ })

};
;