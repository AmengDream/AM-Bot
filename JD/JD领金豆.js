auto.waitFor();
console.verbose("[*]脚本开始执行...");

var appName = "京东";
var timeout = 3000; // 3秒超时

launchApp(appName);
console.verbose("[*]启动应用：" + appName);

mainController();
console.info("[+]脚本执行完毕");

function secKill(){
    console.verbose("[*]等待秒杀按钮...");
    text("秒杀").waitFor();
    // 寻找秒杀按钮并点击
    if (text("秒杀").exists()) {
        console.verbose("[*]找到秒杀按钮");
        var  isClick = click("秒杀");
        if(isClick){
            console.info("[+]秒杀已点击");
            return true;
        }
        else{
            console.error("[!]秒杀点击失败");
        }
    }
    else {
        console.error("[!]未找到秒杀按钮");
    }
    return false;
}

function signIn(){
    console.verbose("[*]查找签到领豆标签," + timeout + "超时...");
    target = text("签到领豆").findOne(timeout);
    if (target) {
        var parent = target.parent(); 
        console.verbose("[*]目标控件:", target.bounds(), "父控件:", parent ? parent.bounds() : "未找到");
        if(parent){
            var isClick = parent.click();
            if(isClick){
                console.info("[+]签到领豆已点击");
                return true;
            }
        }
        else{
            console.error("[!]签到领豆按钮控件未找到");
        }
    } 
    else {
        console.warn("[!]未找到'签到领豆'的文本控件");
        // 检查是否已签到
        if (text("签到日历").exists()) {
            console.info("[+]今天已经签到领豆了,开始赚更多京豆");
            return true;
        }

    }
    return false;
}

function getMoreJDBean(){
    console.verbose("[*]等待secKill_bean_sign_view控件," + timeout + "超时...");
    var bean_sign_view = id("secKill_bean_sign_view").findOne(timeout) 
                  || className("android.view.View").filter(v => 
                     v.id() === "secKill_bean_sign_view").findOne(timeout);
    if (bean_sign_view) {
        console.verbose("[*]找到secKill_bean_sign_view控件");
        var homeSignButton = bean_sign_view.child(1).click();
        if(homeSignButton){
            console.info("[+]已点击homeSignButton控件");
            return true;
        }
        else{
            console.error("[!]homeSignButton控件点击失败");
        }
    } 
    else {
        console.warn("[!]未找到secKill_bean_sign_view的控件");
        // 打印所有View的ID、bounds和子控件数量
        // log(className("android.view.View").find().map(v => `${v.id()} | ${v.bounds()} | children:${v.childCount()}`).join("\n"));
    }
    return false;
}


function mainController(){
    // 1. 进入秒杀界面
    if(!secKill()){
        console.error("[!]未进入秒杀界面");
        return false;
    }

    // 2. 签到领豆
    if(!signIn()){
        while(!signIn()){
            console.error("[!]签到领豆失败,重试中...");
        }
    }

    // 3. 点击升级赚京豆
    if(!getMoreJDBean()){
        console.error("[!]未进入升级赚京豆");
        while(!getMoreJDBean()){
            console.error("[!]升级赚京豆失败,重试中...");
        }
    }

    // todo: 循环点击去完成，完成任务
}