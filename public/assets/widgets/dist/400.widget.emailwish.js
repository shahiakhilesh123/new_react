"use strict";(self.webpackChunkemailwish_widgets=self.webpackChunkemailwish_widgets||[]).push([[400],{2400:function(e,i,t){t.r(i),t.d(i,{default:function(){return s}});var u=t(5893),v=t(7294),h=t(4292),p=t(7657),i=t(7484),g=t.n(i),_=t(9506),j=t(1505),Z=t(9476),f=t(1012),P=t(3962),w=t(7973),y=t(4986),i=t(6176),i=t.n(i),C=t(9698),N=t(8380),k=t(1196),S=function(){return(S=Object.assign||function(e){for(var i,t=1,s=arguments.length;t<s;t++)for(var n in i=arguments[t])Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n]);return e}).apply(this,arguments)};function s(e){var i=e.settings,t=(0,v.useContext)(k.ReviewAppStateContext),s=t.meta_data,n=t.review_settings,r=(0,v.useContext)(k.ReviewAppDispatchContext);console.log(r);var a=(0,C.useSummaryStyles)(i),o=(0,p.Z)(),e=(0,v.useState)({page:1,per_page:50,filter_stars:"0"}),l=e[0],c=e[1],t=(0,v.useState)(),i=t[0],d=t[1],e=(0,v.useState)(!1),t=e[0],m=e[1],x=(0,v.useCallback)(function(){m(!0),s&&(new h.Z).get_all_reviews(s.client_id,l).then(function(e){o.current&&(h.Z.hasError(e)||(e.review_settings&&r({type:"review_settings",review_settings:e.review_settings}),d(e),m(!1)))})},[r,s,l,o]);return(0,v.useEffect)(function(){s&&x()},[x,l,s]),console.log(n),n?(0,u.jsx)("div",S({className:a.review_root_main},{children:(0,u.jsx)(f.ZP,S({style:{marginTop:"8px"}},{children:(0,u.jsx)(P.ZP,S({className:a.review_root},{children:i&&i.items&&(1<i.items.last_page||0<i.items.data.length)&&(0,u.jsx)(P.ZP,S({marginBottom:2},{children:(0,u.jsx)(w.ZP,S({container:!0,spacing:1},{children:!t&&i&&i.items&&i.items.data&&0<i.items.data.length&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(w.ZP,S({item:!0,xs:12},{children:(0,u.jsx)(P.ZP,S({marginBottom:1},{children:(0,u.jsx)(_.GD,S({columnsCountBreakPoints:{200:1,350:2,750:3,900:6}},{children:(0,u.jsx)(_.ZP,S({columnsCount:3,gutter:"10px"},{children:i&&i.items&&i.items.data&&i.items.data.map(function(e,i){return(0,u.jsx)(P.ZP,{children:(0,u.jsx)(P.ZP,S({className:a.review_item_wrapper},{children:(0,u.jsxs)(P.ZP,S({display:"flex",flexDirection:"column"},{children:[e.images&&0<e.images.length&&(0,u.jsx)(P.ZP,S({marginTop:"-1px"},{children:(0,u.jsx)("img",{src:e.images[0].full_path,alt:"reviews",style:{width:"100%",height:"auto"}},void 0)}),void 0),(0,u.jsxs)(P.ZP,S({display:"flex",flexDirection:"column",p:1},{children:[(0,u.jsx)(P.ZP,{children:(0,u.jsx)(Z.ZP,S({className:a.primary_text_color},{children:e.reviewer_name}),void 0)},void 0),(0,u.jsx)(P.ZP,{children:(0,u.jsx)(Z.ZP,S({className:a.primary_text_color},{children:g()(e.created_at).format("L LT")}),void 0)},void 0),(0,u.jsx)(P.ZP,{children:(0,u.jsx)(y.Z,{star:e.stars},void 0)},void 0),(0,u.jsx)(P.ZP,{children:(0,u.jsx)(Z.ZP,S({className:a.primary_text_color},{children:e.title}),void 0)},void 0),(0,u.jsx)(P.ZP,{children:(0,u.jsx)(Z.ZP,S({className:a.primary_text_color},{children:e.message}),void 0)},void 0)]}),void 0)]}),void 0)}),void 0)},i)})}),void 0)}),void 0)}),void 0)}),void 0),(0,u.jsx)(w.ZP,S({item:!0,xs:12},{children:(0,u.jsx)(P.ZP,S({display:"flex",justifyContent:"center"},{children:1<i.items.last_page&&(0,u.jsx)(j.Z,{count:i.items.last_page,page:l.page,className:a.pagination_ui,onChange:function(e,i){c(function(e){return S(S({},e),{page:i})})},renderItem:function(e){return(0,u.jsx)(N.Z,S({},e,{classes:{selected:a.pagination_ui_selected}}),void 0)}},void 0)}),void 0)}),void 0)]},void 0)}),void 0)}),void 0)}),void 0)}),void 0)}),void 0):null}g().extend(i())}}]);