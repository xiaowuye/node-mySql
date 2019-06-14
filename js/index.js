$(function() {
    submitMessage();
    getMessage();
    updateMessage();

});
// 条件查询方法
function condition_span() {
    $("#condition_content").find('span').on('click', function() {
        $(this).addClass('active').siblings('span').removeClass('active');
        let id = $(this).html();
        getConditionMessage(id);
    });
}
// 按照条件获取信息
function getConditionMessage(id, html) {
    let type = html;
    if (id) {
        if (id == '全部') {
            type = '';
        } else {
            type = id;
        }
    }
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://localhost:8888/getConditionIndex?id=' + type,
        success: function(result) {
            let lists_arr = [];
            if (result.message.length > 0) {
                for (let res of result.message) {
                    // 普通查询数据
                    lists_arr.push(`<li>
            <span class="name">${res.name}</span>
            <span class="age">${res.age}</span>
            <span class="del" id="${res.id}">删除</span>
            <span class="update" id="${res.id}">修改</span>
            </li>`);

                }
                $("#lists").html('');
                $("#lists").html(lists_arr);
                delMessage();
                clickUpdateMessage();

            } else {
                $("#lists").html('<div>暂无数据!!!</div>');
            }
        },
        error: function(result) {
            console.log('error');
        }
    });
}
// 获取信息
function getMessage() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://localhost:8888/getIndex',
        success: function(result) {
            let list_arr = [],
                title_arr = [];
            if (result.message.length > 0) {
                for (let res of result.message) {
                    // 普通查询数据
                    list_arr.push(`<li>
              <span class="name">${res.name}</span>
              <span class="age">${res.age}</span>
              <span class="del" id="${res.id}">删除</span>
              <span class="update" id="${res.id}">修改</span>
              </li>`);
                    // 按照条件查询
                    title_arr.push(`<span>${res.id}</span>`);
                    $("#condition_content").html('');
                    $("#condition_content").append(title_arr).append('<span>全部</span>');
                    $("#condition_content").find('span:first').addClass('active');
                }
                $("#list").html('');
                $("#list").html(list_arr);
                delMessage();
                clickUpdateMessage();
                // 条件查询标题
                getConditionMessage(undefined, $("#condition_content").find('.active').html());
                condition_span();
            } else {
                $("#condition_content").html('');
                $("#list").html('<div>暂无数据!!!</div>');
                $("#lists").html('<div>暂无数据!!!</div>');
            }
        },
        error: function(result) {
            console.log('error');
        }
    });
}
// 点击修改信息
function clickUpdateMessage() {
    $(".update").on('click', function() {
        $("#update_name").val($(this).siblings('.name').html());
        $("#update_age").val($(this).siblings('.age').html());
        $("#update_submit").attr('data_id', $(this).attr('id'));
        $("#update_pop").fadeIn(300).css({
            'height': $('body').height()
        });
    });

}
// 修改信息
function updateMessage() {
    $("#update_submit").on('click', function() {
        let $name_val = $("#update_name").val();
        let $age_val = $("#update_age").val();
        let $update_id = $(this).attr('data_id');
        // updateMessage(update_id, $name_val, $age_val);
        let data = {
            name: $name_val,
            age: $age_val,
            id: $update_id
        };
        $.ajax({
            type: 'POST',
            data: data,
            dataType: 'json',
            url: 'http://localhost:8888/upDateIndex',
            success: function(result) {
                $("#update_pop").fadeOut(300);
                getMessage();
            },
            error: function(result) {
                console.log(result);
            }
        });
    });
}
// 删除信息
function delMessage() {
    $('.del').on('click', function() {
        let del_id = $(this).attr('id');
        let data = {
            id: del_id
        };
        $.ajax({
            type: 'POST',
            data: data,
            dataType: 'json',
            url: 'http://localhost:8888/delIndex',
            success: function(result) {
                console.log(result);
                getMessage();
            },
            error: function(result) {
                console.log(result);
            }
        });
    });
}
// 提交信息
function submitMessage() {
    $("#submit").on('click', function() {
        let name = $("#name").val(),
            age = $("#age").val();
        if (name == '') {
            alert('姓名不能为空');
            return false;
        }
        if (age == '') {
            alert('年龄不能为空');
            return false;
        }
        let data = {
            name: name,
            age: age
        };
        $.ajax({
            type: 'POST',
            data: data,
            dataType: 'json',
            url: 'http://localhost:8888/submitIndex',
            success: function(data) {
                $("#name").val('');
                $("#age").val('');
                getMessage();
                console.log(data);
            },
            error: function(result) {
                console.log(result);
            }
        });
    });
}