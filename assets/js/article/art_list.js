$(function(){
    var layer=layui.layer;
    var form=layui.form;
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat=function(date){
        const dt=new Date(date);
        var y=dt.getFullYear();
        var m=padZero(dt.getMonth()+1);
        var d=padZero(dt.getDate());
        var hh=padZero(dt.getHours());
        var mm=padZero(dt.getMinutes());
        var ss=padZero(dt.getSeconds());
        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss;
    }

    //定义补零的函数
    function padZero(n){
      return n>9?n:'0'+n;
    }
    var q={
        pagenum:1,//页码值，默认第一页
        pagesize:2,//默认每页显示两条数据
        cate_id:'',//文章分类的id
        state:'',//文章发布状态
    }
initTable();
initCate();
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                console.log(res);
                if(res.status!==0){
                  return  layer.msg('获取文章列表失败');
                }
                //使用模板引擎渲染页面的数据
              var htmlStr=  template('tpl-table',res);
              $('tbody').html(htmlStr);
              renderPage(res.total);
            }
        })
    }

    //初始化文章分类的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status!==0){
                    return layer.msg('获取分类数据失败');
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr=template('tpl-cate',res);
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //为筛选表单绑定submit事件
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        var cate_id=$('[name=cate_id]').val();
        var state=$('[name=state]').val();
        //为查询参数对象q中对应属性赋值
        q.cate_id=cate_id;
        q.state=state;
        //根据最新的筛选条件重新渲染表格的数据
        initTable();
    })

    //定义渲染分页的方法
    function renderPage(total){
        laypage.render({
            elem:'pageBox',//分页容器的id
            count:total,//总数据条数
            limit:q.pagesize,//每页显示几条数据
            curr:q.pagenum,//设置默认被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            jump:function(obj,first){
                //可以通过first的值来判断是通过那种方式触发的回调
                //如果为true，则是方式2触发的，否则就是方式1
                console.log(first);
                console.log(obj.curr);
                //把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum=obj.curr;
                //把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize=obj.limit;
                //根据最新的q获取对应的列表并渲染对应的表格
                if(first!=true){
                    initTable();
                }
            }
        });//渲染分页的结构

    }

    //通过代理的形式为按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
        var len=$('.btn-delete').length;
        //获取文章的id
var id=$(this).attr('data-id');
        //询问用户是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');

                    if(len===1){
                        q.pagenum=q.pagenum===1?1:q.pagenum-1;
                    }
                    initTable();
                }
            })
            
            layer.close(index);
          });
    })

})