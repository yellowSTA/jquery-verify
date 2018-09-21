# jQuery-verify
> 一个jQuery表单验证插件

# 使用
 + 引入jQuery和jQuery-verify
 ```html
 <script type="text/javascript" src="jquery-3.1.1.min.js" ></script>
 <script src="../jquery-verify.js"></script>
 ```
 + html部分
 ```html
 <div id="form">
     <div class="form-group">
         <label for="username" class="label">用户名</label>
         <input type="text" id="username" placeholder="username" data-verify="require username" data-label = "用户名">
     </div>
 </div>
<!-- 
    给需要验证的input输入框加自定义属性来开启验证,
    如果input的disabled为true，则会略过验证直接执行success函数

    data-verify 用来指定验证规则，如果有多个规则，请使用空格隔开
    data-label 在错误提示语前面加前缀，如 '不能为空' 加前缀变为 '用户名：不能为空'
-->
 ```

 + javascript
 ```javascript
 //设置校验规则
 var gRules = {
     //每个校验规则都是一个对象，
     //method是校验函数，接受的参数是被校验的值，验证失败return false，验证通过 return true
     //message是错误提示语，在method函数中可以通过this.message动态改变
    username: {
        method: function(val){
            val = $.trim(val);
            if(val == ""){
                this.message = "请填写用户名";
                return false;
            }
            
            if(val.indexOf("@") != -1){
                this.message = "用户名格式错误";
                return false;
            }
            return true;
        },
        message: '用户名格式错误！'
    },
    mobile: {
        method: function(val) {
            if(!/^1\d{10}$/.test(val)) {
                return false;
            }
            return true;
        },
        message:'手机格式错误'
    }
}
// 初始化验证器
var verify = Validator({
    formId: '#form', //要验证的表单
    checkAll: false, //true 一次性验证完整个表单 false逐项验证遇到不通过的就停下
    oRules: gRules, //验证规则
    //如果验证不通过 执行函数
    //el是验证的输入框，msg是错误提示语
    errorTips: function(el, msg) {  
        layer.msg(msg);
        $(el).css('border','1px solid #ef4437')
    },
    //如果验证通过 执行函数
    //el是验证的输入框
    success: function(el) { 
        $(el).css('border','1px solid #ccc')
    }
})

$("#submit").click(function() {
    var result = verify.check(); //检查表单的验证结果,true or false
    if(!result) {
        //如果验证不通过，执行.....
        return false;
    }
    //如果验证通过则 执行....
})
 ```