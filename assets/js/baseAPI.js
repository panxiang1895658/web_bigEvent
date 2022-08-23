//注意每次调用$.get,$.post,$.ajax的时候会先调用ajaxPrefilter函数
//这个函数可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options){
console.log(options.url);
options.url='http://www.liulongbin.top:3007'+options.url;
console.log(options.url);
})