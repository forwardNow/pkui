define(function(a){"use strict";function b(a){this.opts=c.extend(!0,{},this.defaults,a),this._init()}var c=a("jquery"),d=a("./sysRoleTree"),e=a("./sysRoleContent");return b.init=function(a){return new b(a)},b.prototype.defaults={containerSelector:"#sysrole-container",sysRoleInfoSelector:"#sysrole-info"},b.prototype._init=function(){this._render(),this._bind()},b.prototype._render=function(){this.$container=c(this.opts.containerSelector),this.$sysRoleInfo=c(this.opts.sysRoleInfoSelector),this.sysRoleTreeInstance=new d,this.sysRoleContentInstance=new e},b.prototype._bind=function(){var a=this,b=null;this.$container.on("clickSysRoleTreeItem."+d.namespace,function(c,d){b=d.roleId,a.$sysRoleInfo.addClass("info").html("正在操作的角色："+(d.roleName||"未命名的角色")),a.sysRoleContentInstance.redraw(b)}),this.$container.on("saved."+d.namespace,function(){a.sysRoleTreeInstance.redraw(b)})},b});