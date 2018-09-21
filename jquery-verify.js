!(function(root, factory){
	if (typeof define === 'function' && define.amd){
		
			define(['jquery'],function() {return factory($, root) })
			
	} else{
		
		factory(jQuery, root)
	}
   
}(this ,function($, window){
	
	//默认参数
	var _default_ = {
		formId : 'form',
		oRules : {
			"required": {
				method: function(val) {
					val = $.trim(val);
					return val != "" ? true : false;
				},
				message: "不能为空!"
			},
			"number": {
				method: function(val) {
					val = $.trim(val);
					var reg = /^[0-9]*$/;
				
					if(!reg.test(val) || val==''){
						return false;
					}
					return true;
				},
				message: "请填写正确的数字格式!"
			}
		},
		success: function(el){
			console.log(el);
		},
		errorTips: function(el, msg){
			console.log('error'+msg);
		},
		blurcheck: false,
		checkAll: false
	}
	
	//构造函数
	
	function Validator (options) {
		
		var opt = $.extend(true, {}, _default_, options);
		
		if(this instanceof Validator){
			
			this.formId = opt.formId;      		//要验证的表单
			this.oRules = opt.oRules;			//验证规则
			this.success = opt.success;			//每个字段验证通过执行函数
			this.errorTips = opt.errorTips; 	//每个字段验证不通过执行函数
			this.checkAll = opt.checkAll;		//true 一次性验证完整个表单 false逐项验证遇到不通过的就停下
			
			this.init();
		
			if(opt.blurcheck){					//true表示 input值改变失去焦点就验证，false不验证
				this.verifyEventsInit();
			}
		} else{
			return new Validator(options);
		}
	}
	
	Validator.prototype = {
		getVerifyObject: function(key){
			var obj = this.oRules[key];
			if(typeof(obj) == "object" && obj.method) {
				return obj;
			}
			return null;
		},
		getVerfiyPars: function(doc){
			var verify = $(doc).data('verify');
			
			if($(doc).is(":disabled")) {
				_this.success(doc);
				return null;
			}
			if(typeof(verify) != "string") {
				return null;
			}
			
			verify = verify.toLowerCase().split(" ");
			
			verify = $.grep(verify, function(value, i) {
				value = $.trim(value);
				verify[i] = value;
				return value != '';
			})
			
			return verify;
		},
		init: function(){
			var doc = this.formId;
			if(!doc){
				throw new Error('请选择要验证的表单!')
				return false;
			};
			
			this.aInput = $(doc).find("input");
			this.aTextarea = $(doc).find("textarea");
		},
		check: function(){
			var flag = true;
			var _this = this;
			
			loop(this.aInput);
			if(flag){
				loop(this.aTextarea);
			}
			
			function loop (dom) {
				dom.each(function(index, el){
					var key,pars,obj,label,errMsg;
					label = $(this).data("label");
					
					var inputType = $(this).attr("type");
					if(inputType == "file") {return true};
					
					pars = _this.getVerfiyPars(el);
					
					if(!pars || pars.length < 1){
						return true;
					}
					
					for (var i=0; i<pars.length; i++) {
						obj = _this.getVerifyObject(pars[i]);
						if(!obj){continue} //如果规则不存在，则跳过
						
						var res = obj.method($(el).val());
						if(inputType == "checkbox"){
							res = obj.method(el);
						}
						
						errMsg = label ? (label+"："+obj.message) : obj.message;
						
						if(!res && res != undefined){
							_this.errorTips(el, errMsg);
							flag = false;
							if(_this.checkAll){
								break;
							} else{
								return false;
							}
						} 
						
						_this.success(el);
						
					}
				})
			}

			return flag;
		},
		verifyEventsInit: function(){
			var _this = this;
			
			$(this.aInput, this.aTextarea).on("change", function() {
				var that = this;
				var key,pars,obj,label,errMsg;
				
				var inputType = $(this).attr("type");
				if(inputType == "file") {return true};
				
				pars = _this.getVerfiyPars($(that));
				
				if(!pars || pars.length < 1){
					return true;
				}
				
				for (var i=0; i<pars.length; i++) {
					obj = _this.getVerifyObject(pars[i]);
					if(!obj){continue}
					
					var res = obj.method($(that).val());
					if(inputType == "checkbox"){
						res = obj.method(that);
					}
					
					label ? errMsg = label+"："+obj.message : errMsg = obj.message;
					
					if(!res && res != undefined){
						_this.errorTips(that, errMsg);
						return false;
					} else{
						_this.success(that);
					}
				}
			});
		},
		addRules: function(options) {
			this.oRules = $.extend(true, {}, this.oRules, options);
		}
	}

	window.Validator = Validator;
	return Validator; 
}))
	
	


