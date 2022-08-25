$(function(){
    var layer=layui.layer;
    var form=layui.form;
    // 定义加载文章分类的方法
    initCate();
    initEditor();
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status!==0){
                    return layer.msg('初始化文章分类失败');
                }
                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr=template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr);
                //一定要调用form.render方法重新渲染表单区域
                form.render();
            }
        })
    }

    // 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
// 纵横比
aspectRatio: 1,
// 指定预览区域
preview: '.img-preview'
}
// 1.3 创建裁剪区域
$image.cropper(options);

$('#btnChooseImage').on('click',function(){
$('#coverFile').click();
})
//监听coverFile的change事件，获取用户选择的文件列表
$('#coverFile').on('change',function(e){
//获取到文件的列表数组
    var files=e.target.files;
    //判断用户是否选择了文件
    if(files.length===0){
        return ;
    }
    //根据文件，创建相应的URL地址
    var newImgURL=URL.createObjectURL(files[0]);
    //裁剪区域重新设置图片
    $image
.cropper('destroy') // 销毁旧的裁剪区域
.attr('src', newImgURL) // 重新设置图片路径
.cropper(options) // 重新初始化裁剪区域

})
//定义文章的发布状态
var art_state='已发布';
//为存为草稿按钮绑定点击事件
$('#btnSave2').on('click',function(){
    art_state='草稿';
})

//为表单绑定submit提交事件
$('#form-pub').on('submit',function(e){
    e.preventDefault();
    //基于form表单快速创建FormData对象
  var fd=  new FormData($(this)[0]);
  //将文章的状态存到fd中
  fd.append('state',art_state);
$image
.cropper('getCroppedCanvas', { 
    // 创建一个 Canvas 画布
width: 100,
height: 100
})
.toBlob(function(blob){
    //将画布上的内容，转化为文件对象
    //将文件对象，存储到fd中
    fd.append('cover_img',blob);
    //发起ajax数据请求
    publishArticle(fd);
})
})
//定义发布文章的方法
function publishArticle(fd){
$.ajax({
    method:'POST',
    url:'/my/article/add',
    data:fd,
    // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType:false,
      processData: false,
      success:function (res){
        if(res.status!==0){
            return layer.msg('发布文章失败');
        }
        layer.msg('发布文章成功');
        location.href='/article/art_list.html';
      }
})
}
})