
/**
 * 无障碍事件调试
 * 用于监听并打印Android无障碍服务触发的各种事件信息
 */


auto.waitFor();

/**
 * 无障碍事件类型数组
 * 包含Android无障碍服务中常见的各种事件类型
 * 不需要监视的事件类型直接注释掉
 */
const accessibilityEvents = [
    // 视图交互事件
    "view_clicked",                      // 控件被点击事件
    "view_long_clicked",                 // 控件被长按点击事件
    "view_selected",                     // 控件被选中事件
    "view_focused",                      // 控件成为焦点事件
    "view_text_changed",                 // 控件文本内容改变事件
    "view_text_selection_changed",       // 文本选择变化事件
    "view_scrolled",                     // 控件被滑动事件
    "view_hover_enter",                  // 悬停进入事件
    "view_hover_exit",                   // 悬停退出事件
    "view_accessibility_focused",        // 无障碍焦点事件
    "view_accessibility_focus_cleared",  // 无障碍焦点清除事件
    
    // 窗口状态事件
    "window_state_changed",              // 窗口状态变化事件
    "window_content_changed",            // 窗口内容变化事件
    "windows_changed",                   // 屏幕上显示窗口的变化事件
    
    // 通知事件
    "notification_state_changed",        // 通知状态变化事件
    "announcement",                      // 无障碍公告事件
    
    // 系统级事件
    "touch_exploration_gesture_start",   // 触摸探索手势开始
    "touch_exploration_gesture_end",     // 触摸探索手势结束
    "touch_interaction_start",           // 触摸交互开始
    "touch_interaction_end",             // 触摸交互结束
    "gesture_detection_start",           // 手势检测开始
    "gesture_detection_end",             // 手势检测结束
    
    // 输入法事件
    "view_text_traversed_at_movement_granularity" // 文本遍历事件
];

// 定义需要获取的事件属性对应的getter方法
const getterMethods = [
    'getEventType',       // 获取事件类型（数字标识）
    'getPackageName',     // 获取触发事件的APP包名
    'getClassName',       // 获取触发事件的控件类名
    'getEventTime',       // 获取事件发生时间（时间戳）
    'getAction',          // 获取事件动作标识
    'getRaw',             // 获取原始事件对象
    'getSource',          // 获取事件关联的控件节点
    'isFullScreen'        // 判断是否全屏事件
];

// 定义中英文方法名映射
const eventNameMap = {
    // 视图交互事件
    "view_clicked": "控件被点击事件",
    "view_long_clicked": "控件被长按点击事件",
    "view_selected": "控件被选中事件",
    "view_focused": "控件成为焦点事件",
    "view_text_changed": "控件文本内容改变事件",
    "view_text_selection_changed": "文本选择变化事件",
    "view_scrolled": "控件被滑动事件",
    "view_hover_enter": "悬停进入事件",
    "view_hover_exit": "悬停退出事件",
    "view_accessibility_focused": "无障碍焦点事件",
    "view_accessibility_focus_cleared": "无障碍焦点清除事件",
    
    // 窗口状态事件
    "window_state_changed": "窗口状态变化事件",
    "window_content_changed": "窗口内容变化事件",
    "windows_changed": "屏幕上显示窗口的变化事件",
    
    // 通知事件
    "notification_state_changed": "通知状态变化事件",
    "announcement": "无障碍公告事件",
    
    // 系统级事件
    "touch_exploration_gesture_start": "触摸探索手势开始",
    "touch_exploration_gesture_end": "触摸探索手势结束",
    "touch_interaction_start": "触摸交互开始",
    "touch_interaction_end": "触摸交互结束",
    "gesture_detection_start": "手势检测开始",
    "gesture_detection_end": "手势检测结束",
    
    // 输入法事件
    "view_text_traversed_at_movement_granularity": "文本遍历事件"
};

const methodNameMap = {
    'getEventType': '事件类型',
    'getPackageName': 'APP包名',
    'getClassName': '控件类名', 
    'getEventTime': '事件时间',
    'getAction': '动作标识',
    'getRaw': '原始事件',
    'getSource': '控件节点',
    'isFullScreen': '是否全屏'
};




// 循环遍历所有事件类型并注册监听
accessibilityEvents.forEach(eventType => {
    auto.registerEvent(eventType, (event) => {
        // 获取中文事件名称
        const chineseEventName = eventNameMap[eventType] || eventType;
        console.log('===== ' + chineseEventName + ' =====');

        // 遍历并调用每个getter方法
        getterMethods.forEach(method => {
            try {
                // 调用方法
                const value = event[method](); 
                let chineseName = methodNameMap[method] || method;
                console.log(`${chineseName}(): ${value}`);
            } catch (err) {
                let chineseName = methodNameMap[method] || method;
                console.log(`${chineseName}(): 无法获取（原因：${err.message}）`);
            }
        });

        // 补充：尝试获取事件关联的文本内容
        try {
            const text = event.text;
            console.log(`文本属性: ${text}`);
        } catch (err) {
            console.log(`文本属性: 无法获取（原因：${err.message}）`);
        }

        console.log('========================\n');
    });
});

// 保持脚本运行
setInterval(() => {}, 1000);
