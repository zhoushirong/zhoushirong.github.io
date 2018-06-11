---
title: 测试
date: 2018/01/29
tag: 测试
---

# epay PC主站的相关url

# epay主站的网页 (https://epay.163.com/main.htm)
## /account/loginRecord.htm 近期登陆记录               /accountLogin/accountOperationLog.jsp
## /card/cardView.htm 我的银行卡                       /WEB-INF/ftl/2015/account/quickPayBank.ftl
## /coupon/hongbao.htm 我的卡券                       /WEB-INF/ftl/2015/account/redpacket.ftl
## /quickpay/bankList.htm 添加快捷银行卡                /quickpay/bankList_v3.jsp
	### quickpay/apply.htm 添加银行卡第二步               /quickpay/apply_v3.jsp
## /account/accountDetailView.htm 账户收支明细          /WEB-INF/ftl/2015/trade/inorout_detail.ftl
## /withdraw/recordView.htm 交易记录                   /WEB-INF/ftl/2015/trade/withdraw.ftl
## /chargeRefund/recordView.htm 充值退回               /WEB-INF/ftl/2015/trade/charge_back.ftl
## /withdraw/view.htm 提现页面                         /WEB-INF/ftl/2015/core/withdraw.ftl
## /account/grade/gradeView.htm 身份验证               /WEB-INF/ftl/2015/account/account-grade.ftl
## /charge/chargeView.htm 充值页面                     /WEB-INF/ftl/charge/index.ftl
## /order/orderDetail.htm?orderId=2018040410JY63453418 交易记录-记录详情  /WEB-INF/ftl/2015/trade/trade_detail.ftl
## /servlet/controller?operation=message 我的站内信 /epay-web/src/main/webapp/messages.jsp
## /appCenter.htm 应用中心 /epay/webpack/epay-pc/src/pages/applications/applications.entry.ftl
## /appCenterForFrame.htm 应用中心frame  /epay/webpack/epay-pc/src/pages/applications-frame/applications-frame.entry.ftl
	### /appCenterForFrame.htm?t=receive 我要收款    /epay-web/src/main/webapp/personaltransfer/receive_info.jsp
	### /appCenterForFrame.htm?t=payto 我要付款      /epay-web/src/main/webapp/personaltransfer/pay_info.jsp
## /account/accountAsset.htm 账户管理-我的资产       /WEB-INF/ftl/2015/account/assets.ftl
	### /account/basicInfo.htm 账户管理-基本信息       /WEB-INF/ftl/2015/account/base_info.ftl
		#### /accountSet/updateIdentityNoValidDate/toView.htm 更新身份证有效期    /accountset/updateIdentityNoValidDate.jsp

## /order/recordView.htm 交易记录页面                    /WEB-INF/ftl/2015/trade/consume.ftl
	### /trade/hisdata/view.htm 交易下载区                 /WEB-INF/ftl/2015/trade/hisdata/view.ftl
	### /quickpay/quickPayAgreement.jsp # 银行卡快捷支付服务协议  /epay-web/src/main/webapp/quickpay/quickPayAgreement.jsp

## /accountmobile/replace_mobile_choose.htm  重置手机  /epay-web/src/main/webapp/replace_mobile/replace_mobile_choose_v30.jsp
	### /accountmobile/replace_view.htm 重置手机-使用手机接收短信 /epay-web/src/main/webapp/accountmobile/replaceMobileView_v30.jsp

	### /servlet/controller?operation=retrievePassView 账户管理-安全设置-找回支付密码  /epay-web/src/main/webapp/urs/retrievePayPasswordMethodView.jsp
	#### /servlet/controller?operation=retrievePayPasswordChoice&passmethod=1 密保手机找回支付密码 /epay-web/src/main/webapp/accountmobile/retrievePasswordView_v30.jsp
	#### /servlet/controller?operation=retrievePayPasswordChoice&passmethod=2 安全问题找回支付密码 /epay-web/src/main/webapp/urs/retrievePayPasswordView.jsp （未证实）
	#### /servlet/controller?operation=retrievePayPasswordChoice&passmethod=3 密保邮箱找回支付密码 /epay-web/src/main/webapp/bindemail/emailRetrivePassView.jsp
	#### /servlet/controller?operation=retrievePayPasswordChoice&passmethod=8 人工审核 （跳走了，不管）

## /account/secureSetting.htm 安全设置 /WEB-INF/ftl/2015/account/safety.ftl
	### /servlet/controller?operation=modifyPayPassword&method=modifyView 修改支付密码 /epay-web/src/main/webapp/urs/modifyPaypasswordView.jsp
	### /sendnotice/customListView.htm 订阅提醒消息 /epay-web/src/main/webapp/sendNotice/customize_view_v30.jsp
	### /account/doubleCheckView.htm 陌生环境登录时验证密保 /epay-web/src/main/webapp/WEB-INF/ftl/2015/account/doubleCheck.ftl
	### /passProtectCustom/view.htm 开启电脑端免密支付 /epay-web/src/main/webapp/accountset/pass_protect_custom_view.jsp


/account/declaration/mobileEnhanceVerify.htm 手机号码增强校验，需要特定条件才能打开(打开操作失败)


## /servlet/controller?operation=micropay 小额免密支付功能暂停开放(打开操作失败)
	### /servlet/controller?operation=unBindEmailView 账户管理-安全设置-解绑密保邮箱 /epay-web/src/main/webapp/bindemail/unBindEmailView_v30.jsp
		#### /servlet/controller?operation=forgetBindEmailView 账户管理-安全设置-忘记密保邮箱 /epay-web/src/main/webapp/bindemail/forgetBindEmailView_v30.jsp
			##### /servlet/controller?operation=unBindEmailWithMobileView 忘记密保邮箱-使用手机接受短信 /epay-web/src/main/webapp/bindemail/unBindEmailWithMobileView_v30.jsp
	### /accountquestion/check_view.htm 账户管理> 安全设置>安全问题-设置新安全问题答案 /epay-web/src/main/webapp/urs/addQuestionView.jsp
	### （同上面的类似，该是修改问题之类的，暂未找到对应的线上页面）/epay/epay-web/src/main/webapp/urs/modifyQuestionView.jsp

## /jjl/bindJjl.jsp 绑定将军令 /epay/epay-web/src/main/webapp/jjl/bindJjl.jsp

## /download/app/pc.htm	pc下载网易支付App
/servlet/controller?operation=bindAccountMobile&method=view 绑定手机(未重现，没有该类型账号)
/servlet/controller?operation=bindEmailView 绑定邮箱 /epay-web/src/main/webapp/bindemail/bindEmailView_v30.jsp (不止这一个页面，而是一系列页面)

/servlet/invalidateSession?sid=abcMFCLp3EsOX72xbP9kw 退出登录
productDetail.htm?productId=000012&utm_source=epay&utm_medium=xrlbanner&utm_campaign=lhb30&mmd=epay&mpl=xrlbanner&mkw=lhb30


# 收银台
	## /servlet/controller?operation=showGoods 收银台一分钱体验中心 /epay-web/src/main/webapp/yifenqian/showGoods.jsp
	## /servlet/controller?operation=confirmOrder&p=1 一分钱体验商品详情页 /epay-web/src/main/webapp/yifenqian/confirmOrder.jsp
	## /cashier/standardCashier?orderId=2018050315JY31498228 收银台
	## /cashier/orderSuccess?orderId=2018050315JY31498228 订单结果页
	## /cashier/gatePayView?orderId=2018041314JY82551131 网关收银台


## account/registStep1.htm 注册第一步 /WEB-INF/ftl/regist/step1.ftl
## account/registStep2.htm 注册第二步 /WEB-INF/ftl/regist/step2.ftl

# 非epay.163域名下的链接，可以不管
https://mima.163.com/nie/ts_epay_index.aspx
http://caipiao.163.com/#from=epay.header
http://analytics.163.com/ntes_clck?urlid=859&sign=b476a00d246146c7d6316a911f88d411&url=http%3A%2F%2Fp.epay.163.com%2Findex.htm	
http://reg.163.com/otp/controller/unbind.jsp?username=zhoushirongemail@163.com
http://reg.163.com/setinfo/ChangePwd_1.jsp?username=zhoushirongemail@163.com
http://epay.gm.163.com/
https://8.163.com/#from=logo
https://www.95516.com/portal/open/init.do?entry=open
http://trip.163.com/#home
http://mall.163.com/jiaofei/
https://xyk.163.com/
http://gs.163.com/app/newbie/index
https://gift.163.com
http://yuedu.163.com/
http://fa.163.com/dcenter
http://yxp.163.com
http://piao.163.com/
http://ekey.163.com
//i.epay.126.net/a/eyq/old/download/nEdit.exe
https://8.163.com/
http://reg.163.com/otp/controller/unbind.jsp?username=zhoushirongemail@163.com
http://reg.163.com/mibaoka/my.jsp?username=zhoushirongemail@163.com
http://reg.163.com/mibaoka/index.html?func=bind
http://ecard.163.com/account/query_balance
http://1.163.com/cart/index.do?gid=895&num='+$('#yyInput').val()+'&from=wyb_shouye' (window.open)
http://windows.microsoft.com/zh-cn/windows/upgrade-your-browser
https://help.epay.163.com/showdetails.html?dirid=2013052718DT16787225&qId=2013071019HQ81648666#2013071019HQ81648666
https://help.epay.163.com/
https://sealinfo.verisign.com/splash?form_file=fdf/splash.fdf&dn=epay.163.com&lang=zh_cn
//i.epay.126.net/a/eyq/old/images/paymentlicense.pdf?201804241502
http://122.224.75.236/wzba/login.do?method=hdurl&doamin=http://www.neteasepay.com/&id=330100000126045&SHID=1223.0AFF_NAME=com.rouger.%20gs.main.UserInfoAff&AFF_ACTION=qyhzdetail&PAGE_URL=ShowDetail



# 获取网页url的脚本
```javascript
function getLink() {
var str = '';
var as = document.getElementsByTagName("a");
var obj = {};
for (var i = 0; i < as.length; i++) {
var href = as[i].getAttribute('href');
if (href !== 'javascript:;') {
obj[href] = true;
}
}

for (var i in obj) {
str += i + " | "
}
console.log(str)
}
getLink();
```



## 整理之后的相关jsp页面

| 描述 | 线上url | 对应页面 |
|---|---|---|---|
| 近期登陆记录 | /account/loginRecord.htm | /accountLogin/accountOperationLog.jsp |
| 添加快捷银行卡	/quickpay/bankList.htm | /quickpay/bankList_v3.jsp |
| 添加银行卡第二步 | quickpay/apply.htm | /quickpay/apply_v3.jsp |
| 我的站内信 | /servlet/controller?operation=message | /epay-web/src/main/webapp/messages.jsp |
| 我要收款 | /appCenterForFrame.htm?t=receive | /epay-web/src/main/webapp/personaltransfer/receive_info.jsp |
| 我要付款 | /appCenterForFrame.htm?t=payto | /epay-web/src/main/webapp/personaltransfer/pay_info.jsp |
| 更新身份证有效期 | /accountSet/updateIdentityNoValidDate/toView.htm | /accountset/updateIdentityNoValidDate.jsp |
| 银行卡快捷支付服务协议 | /quickpay/quickPayAgreement.jsp | /epay-web/src/main/webapp/quickpay/quickPayAgreement.jsp |
| 重置手机 | /accountmobile/replace_mobile_choose.htm | /epay-web/src/main/webapp/replace_mobile/replace_mobile_choose_v30.jsp |
| 重置手机-使用手机接收短信 | /accountmobile/replace_view.htm | /epay-web/src/main/webapp/accountmobile/replaceMobileView_v30.jsp |
| 订阅提醒消息 | /sendnotice/customListView.htm | /epay-web/src/main/webapp/sendNotice/customize_view_v30.jsp |
| 账户管理-安全设置-找回支付密码 | /servlet/controller?operation=retrievePassView | /epay-web/src/main/webapp/urs/retrievePayPasswordMethodView.jsp |
| 密保手机找回支付密码 | /servlet/controller?operation=retrievePayPasswordChoice&passmethod=1 | /epay-web/src/main/webapp/accountmobile/retrievePasswordView_v30.jsp |
| 安全问题找回支付密码 | /servlet/controller?operation=retrievePayPasswordChoice&passmethod=2 | /epay-web/src/main/webapp/urs/retrievePayPasswordView.jsp（未证实） |
| 密保邮箱找回支付密码 | /servlet/controller?operation=retrievePayPasswordChoice&passmethod=3 | /epay-web/src/main/webapp/bindemail/emailRetrivePassView.jsp |
| 修改支付密码 | /servlet/controller?operation=modifyPayPassword&method=modifyView | /epay-web/src/main/webapp/urs/modifyPaypasswordView.jsp |
| 开启电脑端免密支付 | /passProtectCustom/view.htm | /epay-web/src/main/webapp/accountset/pass_protect_custom_view.jsp |
| 账户管理-安全设置-解绑密保邮箱 | /servlet/controller?operation=unBindEmailView | /epay-web/src/main/webapp/bindemail/unBindEmailView_v30.jsp |
| 账户管理-安全设置-忘记密保邮箱 | /servlet/controller?operation=forgetBindEmailView | /epay-web/src/main/webapp/bindemail/forgetBindEmailView_v30.jsp |
| 忘记密保邮箱-使用手机接受短信 | /servlet/controller?operation=unBindEmailWithMobileView | /epay-web/src/main/webapp/bindemail/unBindEmailWithMobileView_v30.jsp |
| 账户管理>安全设置>安全问题-设置新安全问题答案 | /accountquestion/check_view.htm | /epay-web/src/main/webapp/urs/addQuestionView.jsp (不止这一个页面，而是一系列页面) |
| 绑定将军令 | /jjl/bindJjl.jsp | /epay/epay-web/src/main/webapp/jjl/bindJjl.jsp |
| 绑定邮箱 | /servlet/controller?operation=bindEmailView | /epay-web/src/main/webapp/bindemail/bindEmailView_v30.jsp (不止这一个页面，而是一系列页面) |
| 收银台一分钱体验中心 | /servlet/controller?operation=showGoods | /epay-web/src/main/webapp/yifenqian/showGoods.jsp |
| 一分钱体验商品详情页 | /servlet/controller?operation=confirmOrder&p=1 | /epay-web/src/main/webapp/yifenqian/confirmOrder.jsp |

