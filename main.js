
width = device.width

height = device.height

function transfor(phone, money) {
    // 打开转账页面
    app.startActivity({
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=20000116",
    })
    sleep(1000)

    log("转账界面已打开")

    for (var i = 0; i < 5; i++) {
        //寻找“转账到支付宝”按钮，间隔0.5秒，找5次
        if (className("android.view.View").text("转到支付宝").exists()) { 
            //找到控件后获得控件位置
            let target = className("android.view.View").text("转到支付宝").findOne().parent().bounds()
            // 模拟点击控件
            click(target.centerX(), target.centerY())
            sleep(500)
            // 输入手机号码
            id("com.alipay.mobile.antui:id/input_edit").findOne().setText(phone)
            sleep(500)
            // 点击确认
            id("com.alipay.mobile.transferapp:id/tf_toAccountNextBtn").findOne().click()
            break;
        }
        sleep(500)
    }

    if (i == 5) {
        // 未找到“转账到支付宝”按钮，返回报错
        return 0
    }
    log("已输入账号")


    for (var i = 0; i < 5; i++) {
        // 若存在多账号选择常用账号
        if (id("com.alipay.mobile.socialcontactsdk:id/active_flag").exists()) {
            //要支持的动作
            id("com.alipay.mobile.socialcontactsdk:id/active_flag").findOne().parent().click()
            break;
        }
        sleep(500)
    }

    for (var i = 0; i < 5; i++) {
        // 输入转账金额
        if (id("com.alipay.mobile.antui:id/amount_edit").exists()) {
            let target = id("com.alipay.mobile.antui:id/amount_edit").findOne()
            target.click()
            sleep(500)
            target.setText(money)
            id("com.alipay.mobile.antui:id/au_key_confirm").findOne().click()
            break;
        }
        sleep(500)
    }

    if (i == 5) {
        // 未出现转账金额页面，退出程序
        return 0
    }

    log("已输入金额")

    sleep(500)
    for (var i = 0; i < 30; i++) {
        // 点击立即付款
        if (className("android.widget.TextView").text("立即付款").exists()) {
            // className("android.widget.TextView").text("立即付款").findOne().parent().click()
            let target = className("android.widget.TextView").text("立即付款").findOne().parent().bounds()
            // 模拟点击控件
            click(target.centerX(), target.centerY())
            sleep(500)
            break;
        }
        sleep(500)
        // toastLog(className("android.widget.TextView").text("立即付款").exists());
    }

    if (i == 30) {
        // 未检测到立即付款按钮，退出程序
        return 0

    }

    log("已选择付款")
    for (var i = 0; i < 5; i++) {
        // 若存在指纹验证跳过，使用密码
        if (className("android.widget.TextView").text("请验证指纹").exists()) {
            id("com.alipay.android.phone.seauthenticator.iotauth:id/fp_auth_btn_switch").findOne().click()
            break;
        }
        sleep(500)
    }
    for (var i = 0; i < 5; i++) {
        // 输入密码
        if (id("com.alipay.android.phone.mobilecommon.verifyidentity:id/pwd_title").exists()) {
            for (let i = 0; i < password.length; i++) {
                id("com.alipay.mobile.antui:id/au_num_" + password[i]).findOne().click()
            }
            break;
        }
        sleep(500)
    }

    if (i == 5) {
        // 未检测到键盘，退出程序
        return 0

    }
    log("已输入密码")

    return 1
}
function get_list(path)
{
    if (files.exists(path))
    {
        var number_list = files.open(path, "r")
        var lines=number_list.readlines()
        return lines
    }
    else{
        return 0;
    }

}
function main() {

    app.launchApp("Auto.js")

    sleep(1000)
    //打开支付宝
    app.launchApp("支付宝")

    get_list("phone.txt").forEach((v, i) => {
        transfor_info = v.split(",")

        if (transfor(transfor_info[0], transfor_info[1])) {
            for (let i = 0; i < 5; i++) {
                // 
                if (className("android.widget.TextView").text("转账成功").exists()) {
                    id("com.alipay.android.app:id/nav_right_textview").findOne().click()
                    sleep(1000)
                    break;
                }
                sleep(500)
            }

            for (let i = 0; i < 5; i++) {
                // 
                if (id("com.alipay.mobile.antui:id/back_button").exists()) {
                    id("com.alipay.mobile.antui:id/back_button").findOne().click()
                    break;
                }
                sleep(500)
            }
            sleep(1000)
            // app.launchApp("Auto.js")
        }
        toast(v)
    });
    app.launchApp("Auto.js")
}
var password = "******"

toast('开始自动转账！');
main()

toast('finish!');