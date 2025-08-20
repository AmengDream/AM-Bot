auto.waitFor();  // 等待无障碍服务启用，确保脚本可以正常操作手机界面
app.launchApp("大麦");  // 启动大麦APP
console.show();  // 显示控制台窗口，用于输出日志信息
console.setSize(700, 1000);  // 设置控制台窗口大小为宽700像素、高1000像素
console.setPosition(100,100);  // 设置控制台窗口在屏幕上的位置（坐标100,100）

// 预先说明：滑块验证可能需要更换设备、路由器或使用手机网络
// （不同网络环境可能影响滑块验证的成功率）

/*************[模拟点击]设置*********/
// 步骤1：在大麦APP的倒计时页面填写观影人信息
// 步骤2：在此处设置要抢的场次（周X）和票价（数字）
var ticketInfo = {
    date: "周五",  // 目标场次（如“周五”）
    price: "377"   // 目标票价（如“377元”）
};

// 步骤2.1：倒计时归零时，按钮可能短暂变为“立即订购”又变回“立即预约”
// 说明APP会重新请求服务器时间，此处添加延迟（抖动）以应对
var zeroToWait = 0;  // 抖动时间（毫秒），默认为0

// 步骤3：打开大麦APP，进入倒计时页面（预约界面）
// 步骤4：返回Auto.js运行此脚本，自动跳转到大麦APP
/*************[模拟点击]设置结束*********/

/*************[努力刷新]按钮设置*********/
var freshBtnReconize = "努力刷新";  // 定义“努力刷新”按钮的文本标识
/*************[努力刷新]按钮设置结束*********/

/*************[滑块模拟滑动]设置*********/
var reconizeSliper = "向右滑动验证";  // 滑块验证的文本标识
var offsetX = 25;  // 滑块横向点击偏移量（调整点击位置）
var offsetY = 0;   // 滑块纵向点击偏移量
var swipeLength = 2000;  // 滑块滑动距离（像素）
var swipeTime = 100;     // 滑动耗时（毫秒）
/*************[滑块模拟滑动]设置结束*********/

/******************模拟点击程序*******************/
main(ticketInfo);  // 启动主函数，传入票务信息

// 主函数：控制整个抢票流程
function main(ticketInfo) {

    /******************************
    *   倒计时流程
    *******************************/

    // 从界面获取开抢时间（通过控件ID）
    var UIStartTime = id("id_project_count_sell_time").findOne();
    // 获取控件显示的文本（如“2023年08月20日 10:00”）
    var strStartTime = UIStartTime.text();
    console.verbose("[*]获取到开抢时间: " + strStartTime);

    // 获取“已预约”按钮的坐标（通过控件ID）
    var btnBooking = id("trade_project_detail_purchase_status_bar_container_fl").findOne();
    var rectBtnBuy = btnBooking.bounds();  // 获取按钮的边界矩形
  	// 如果一个控件本身无法通过click()点击，那么我们可以利用bounds()函数获取其坐标，再利用坐标点击。
    var clickPosX = rectBtnBuy.centerX();  // 按钮中心X坐标
    var clickPosY = rectBtnBuy.centerY();  // 按钮中心Y坐标
    console.verbose("[*]获取到的点击坐标: " + clickPosX + ", " + clickPosY);

    // 解析开抢时间并转换为时间戳
    var year = new Date().getFullYear();  // 当前年份
    var month = strStartTime.slice(strStartTime.indexOf("月") - 2, strStartTime.indexOf("月")) - 1;  // 月份（0-11）
    var day = strStartTime.slice(strStartTime.indexOf("日") - 2, strStartTime.indexOf("日"));  // 日
    var hour = strStartTime.slice(strStartTime.indexOf(":") - 2, strStartTime.indexOf(":"));  // 小时
    var minute = strStartTime.slice(strStartTime.indexOf(":") + 1, strStartTime.indexOf(":") + 3);  // 分钟
    var second = 0;  // 秒
    var msecond = 0; // 毫秒
    var startTimestamp = new Date(year, month, day, hour, minute, second, msecond).getTime();
    startTimestamp = startTimestamp - 40;  // 提前40毫秒（抵消网络延迟）
    var damaiTimestamp;
    var startTime = convertToTime(startTimestamp);  // 转换为可读时间格式
    console.info("[*]开始时间：\n", startTime);
    console.verbose("[*]等待开抢...");

    // 循环等待，直到到达开抢时间
    while (true) {
        damaiTimestamp = getDamaiTimestamp();  // 获取大麦服务器时间
        if (damaiTimestamp >= startTimestamp) {
            console.info("[!]到点了，自动开始...");
            break;
        }
        var mm = startTimestamp - damaiTimestamp;  // 剩余毫秒
        var ss = mm / 1000;  // 剩余秒
        if (ss > 100) {
            print("[*]剩余：" + (ss) + "秒");
        } else {
            print("[*]剩余：" + (mm) + "毫秒");
        }
    }

    /******************************
    *   抢票流程
    *******************************/

    // 启动“努力刷新”按钮检测线程
    jumpFreshBtu();
    // 启动滑块检测线程
    sliperFunc();
    // 添加抖动延迟（防止APP重新校准时间）
    console.verbose("[*]加入抖动：" + zeroToWait + "ms");
    sleep(zeroToWait);

    // 1.点击“立即购买”按钮

    // 控件id点击
    // var buyB = id("trade_project_detail_purchase_status_bar_container_fl").findOne();
    // click(buyB.text());

    // 坐标点击
    click(clickPosX, clickPosY);
    console.verbose("点击立即预订按钮");

    // 选择场次（通过文本和层级关系定位）
    // textContains(ticketInfo.date).findOne().parent().parent().parent().parent().click();
    // console.info("选择场次：" + ticketInfo.date);

    // 选择票档（同上）
    // textContains(ticketInfo.price).findOne().parent().parent().parent().parent().click();
    // console.info("选择票档：" + ticketInfo.price);

    // 2.点击“确定”按钮
    id("btn_buy_view").findOne().click();
    console.verbose("点击红色确定按钮");
    console.verbose("进入提交订单页面");

    // 3.点击“立即提交”按钮
    text("立即提交").findOne().click();
    console.verbose("点击提交订单按钮");

    // 记录订单提交时间
    var endTime = convertToTime(getDamaiTimestamp());
    console.info("订单提交时间：" + endTime);
}

/******************自动点击[努力刷新]按钮程序*******************/
function jumpFreshBtu() {
    threads.start(function() {  // 启动新线程
        while (true) {
            var tt = textContains(freshBtnReconize).findOne();  // 查找“努力刷新”按钮
            var x = tt.bounds().left;  // 按钮左边界坐标
            var y = tt.bounds().centerY();  // 按钮垂直中心坐标
            console.verbose("找到[努力刷新]坐标(" + x + "," + y + ")");
            console.verbose("点击[努力刷新]");
            tt.click();  // 点击按钮
            sleep(200);  // 延迟200毫秒（避免频繁点击）
        }
    });
}

/******************滑块程序:模拟滑动*******************/
function sliperFunc() {
    var loopT = 1;  // 循环计数器
    var findSliper = false;  // 是否找到滑块标志

    // 日志线程：显示检测滑块的进度
    var logThreads = threads.start(function() {
        while (true) {
            if (findSliper) continue;  // 如果已找到滑块，跳过本次循环
            console.verbose("检测滑块标识(" + reconizeSliper + ")ing：" + (loopT++) + "次");
            sleep(1000);
            if (loopT % 20 == 0) {
                console.clear();  // 每20次清屏（避免日志堆积）
            }
        }
    });

    // 滑块检测线程
    threads.start(function() {
        while (true) {
            var tt = textContains(reconizeSliper).findOne();  // 查找滑块
            findSliper = true;  // 标记已找到滑块
            var x = tt.bounds().left;  // 滑块左边界坐标
            var y = tt.bounds().centerY();  // 滑块垂直中心坐标
            console.verbose("找到滑块坐标(" + x + "," + y + ")");
            console.verbose("尝试滑动");
            // 模拟滑动操作（从起始位置到终点位置）
            swipe(x + offsetX, y + offsetY, x + swipeLength, y + offsetY, swipeTime);
            sleep(500);  // 滑动后延迟500毫秒
            findSliper = false;  // 重置标志
        }
    });
}

/***********************************工具函数********************************/
/**
 * 将时间戳转换为北京时间（ISO 8601格式）
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 格式化后的时间字符串（如 "2023-08-20 10:00:00.000"）
 */
function convertToTime(timestamp) {
    var date = new Date(Number(timestamp));
    var year = date.getUTCFullYear();
    var month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    var day = date.getUTCDate().toString().padStart(2, "0");
    var hours = (date.getUTCHours() + 8).toString().padStart(2, "0");  // UTC+8
    var minutes = date.getUTCMinutes().toString().padStart(2, "0");
    var seconds = date.getUTCSeconds().toString().padStart(2, "0");
    var milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * 获取大麦服务器时间戳（用于校准本地时间）
 * @returns {number} 服务器返回的时间戳（毫秒）
 */
function getDamaiTimestamp() {
    return JSON.parse(http.get("https://mtop.damai.cn/gw/mtop.common.getTimestamp/", {
        headers: {
            'Host': 'mtop.damai.cn',
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Xiaomi 14 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
            'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        }
    }).body.string()).data.t;
}