define(function(a){var b=a("jquery"),c={};return c.defaults={prefix:"{%",postfix:"%}"},c._regex=/{%\s*([.a-zA-Z0-9_]+)\s*%}/gm,c._configSet={},c._resetRegex=function(){var a,b=this._escapeRegex(this.defaults.prefix),c=this._escapeRegex(this.defaults.postfix);a=b+"\\s*([.a-zA-Z0-9_]+)\\s*"+c,this._regex=new RegExp(a,"gm")},c.setOptions=function(a){b.extend(this.defaults,a),this._resetRegex()},c.appendMatchSource=function(a,b){var c,d=this._configSet;if(!a)throw"error";for(c in a)a.hasOwnProperty(c)&&(d.hasOwnProperty(c)?b?console.warn("同名属性["+c+"]，处理方式：跳过。"):(d[c]=a[c],console.warn("同名属性["+c+"]，处理方式：覆盖原属性。")):d[c]=a[c])},c.process=function(a){var b=this._configSet;return a?a=a.replace(this._regex,function(a,c){if(!b.hasOwnProperty(c))throw"占位符替换失败：没有配置["+c+"]占位符";return b[c]}):a},c._escapeRegex=function(a){return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},c._init=function(){},c._init(),c});