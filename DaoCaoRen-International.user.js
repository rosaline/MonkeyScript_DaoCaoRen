// ==UserScript==
// @name         DaoCaoRen-International
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  这是一段计算队员籍贯及星座的脚本，只有初步功能，欢迎使用，更欢迎你一起来增强代码功能！
// @author       Rosaline Zeng (ALI)
// @match        https://api.54traveler.com/oper/leader/E*/printFee
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
   'use strict';
    // 注意：计算开团后15天内队员中有过生日的人，请知悉。

    var $DEFAULT = 15;
    var days = window.prompt("国际出队天数：(请输入1-31之内的数字，默认" + $DEFAULT + "天哟，为了计算队员生日哒)", $DEFAULT);
    var $DAYS = validateDays(days);

   $('table tbody tr').each(function(iTR, tr){
       
       // Get team members' constellation
       var $birth = $($('td',tr).get(7)).text().trim();
       var $birth_tr = $($('td',tr).get(13));
       var $y = $birth.substr(0,4);
       var $m = $birth.substr(5,2);
       var $d = $birth.substr(8,2);
       var $mem_birth = $m + $d;
       if ($mem_birth) {
           if (isBirthday($mem_birth)) {
               // 快过生日了
               $birth_tr.text($birth_tr.text() + getAstro($m, $d) + ", " + getAge($y) + " " + " 🎂");
           } else {
               $birth_tr.text($birth_tr.text() + getAstro($m, $d) + ", " + getAge($y) + " ");
           }
       } else {
           $birth_tr.text("咦，歪果仁? " + $birth_tr.text());
       }


   });

    // 星座
    function getAstro(m,d){
        return "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m*2-(d<"102223444433".charAt(m-1) + 19)*2,2);
    }

    // 年龄
    function getAge(y){
        var $d = new Date();
        var $now_year = $d.getFullYear();
        return ($now_year - y);
    }

    // 是否快过生日了
    function isBirthday(member_date) {
        // 开团日期
        var $tuan_id = $($('h4'));
        var $tuan_date = $tuan_id.text().trim().substr(6,4);
        var member_date_format = formatStringtoDate(member_date);
        var tuan_date_format = formatStringtoDate($tuan_date);

        if((member_date_format - tuan_date_format) < 0) {
            member_date_format.setFullYear (new Date().getFullYear() +1);
        }

        var $compare = (member_date_format - tuan_date_format)/86400000; //days

        if( $compare <= $DAYS) {
            return true;
        } else if ($compare < 0){
            return false;
        }
    }

    function formatStringtoDate(newString) {
        var newDate = new Date();
        newDate.setMonth(newString.substr(0,2) *1 -1);
        newDate.setDate(newString.substr(2,2));

        return newDate;
    }

    function validateDays($days) {
        if($days > 0 && $days < 32) {
            return $days;
        } else {
            return $DEFAULT;
        }
    }
})();
