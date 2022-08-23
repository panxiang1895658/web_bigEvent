$(function () {
    getUserInfo();
    $('#btnLogout').on('click', function () {
        //提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //1.清空本地存储中的token 
            localStorage.removeItem('token');
            //重新跳转到登录页
            location.href = '/login.html';
            //关闭confirm询问框
            layer.close(index);
        });
    });
})
//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers:{
        //     Authorization:localStorage.getItem('token')||''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            //渲染用户头像
            renderAvatar(res.data);
        },
        // 不论成功和失败，最终都会调用complete回调函数
        // complete: function (res) {
        //     if (res.responseJSON.status=== 1 &&  res.responseJSON.message === '身份认证失败！') {
        //         //强制清空token
        //         localStorage.removeItem('token');
        //         //强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}
function renderAvatar(user) {
    //获取用户的名称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //按需渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //渲染文本图像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show;
    }
}