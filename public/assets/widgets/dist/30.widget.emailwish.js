(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{451:function(t,n,o){"use strict";o.r(n);var e=o(3),i=o(1),r=o(54),u=o(114),c=function(){return(c=Object.assign||function(t){for(var n,o=1,e=arguments.length;o<e;o++)for(var i in n=arguments[o])Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i]);return t}).apply(this,arguments)};function p(t){return Object(e.jsx)(u.a,c({},t),void 0)}var a=function(){return(a=Object.assign||function(t){for(var n,o=1,e=arguments.length;o<e;o++)for(var i in n=arguments[o])Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i]);return t}).apply(this,arguments)};n.default=function(){var t=Object(i.useContext)(r.AppStateContext),n=(t.loading_popup,t.popup),o=t.submitting_form,u=Object(i.useContext)(r.AppFunctionContext);return Object(i.useEffect)((function(){n&&u.onPopupView&&u.onPopupView()}),[u,n]),n?Object(e.jsx)(p,a({},n,{onPositiveButtonClicked:u.onPositiveButtonClicked,onNegativeButtonClicked:u.onNegativeButtonClicked,creationMode:!1,submitting_form:o}),void 0):null}}}]);