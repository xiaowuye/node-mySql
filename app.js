const express = require('express');
const app = express();
const url = require('url'); //暂时没有用到
const mysql = require('mysql');
//导入cors模块,该模块为跨域所用
const cors = require('cors');
app.use(cors());

//解析表单的插件
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
    host: 'localhost', //数据库地址
    user: 'root', //数据库账号
    password: '', //数据库密码
    database: 'test', //数据库名
    multipleStatements: true, //允许执行多条语句
    useConnectionPooling: true
});
connection.connect();

//设置跨域访问
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By", ' 3.2.1');  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();
});

// 增加数据接口名称
app.post('/submitIndex', (req, res) => {
    const content = req.body;
    const sqlStr = 'INSERT INTO node_data_1 (name, age) VALUES (?,?)';
    const _mes_data = [content.name, content.age];
    connection.query(sqlStr, _mes_data, (err, results) => {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return res.json({ code: 10001, message: '添加失败' });
        }
        res.json({ code: 200, message: '添加成功' });
    });
});
//删除数据接口名称
app.post('/delIndex', function(req, res) {
    let content = req.body;
    const sqlStr = 'DELETE FROM node_data_1 WHERE id=' + content.id;
    connection.query(sqlStr, function(err, rows) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return res.json({ code: 10003, message: '删除失败' });
        }
        res.json({ code: 200, message: '删除成功' });
    });
});
// 修改数据接口名称
app.post('/upDateIndex', function(req, res) {
    let content = req.body;
    const sqlStr = 'UPDATE node_data_1 SET name = ?,age = ? WHERE id = ? ';
    const _mes_data = [content.name, content.age, content.id];
    connection.query(sqlStr, _mes_data, function(err, rows) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return res.json({ code: 10004, message: '修改失败' });
        }
        res.json({ code: 200, message: '修改成功' });
    });
});

//查询数据接口名称
app.get('/getIndex', function(req, res) {
    const sql = 'select * from node_data_1';
    connection.query(sql, function(err, rows) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return res.json({ code: 10002, message: '查询失败' });
        }
        res.json({ code: 200, message: rows });
    });
});

//按照条件查询数据接口名称
app.get('/getConditionIndex', function(req, res) {
    let sql;
    if (req.query.id != '') {
        sql = 'select * from node_data_1 where id=' + req.query.id;
    } else {
        sql = 'select * from node_data_1';
    }
    connection.query(sql, function(err, rows) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return res.json({ code: 10002, message: '查询失败' });
        }
        res.json({ code: 200, message: rows });
    });
});

// 防止断开与mySql的连接，so注释掉。
// connection.end();

//配置服务端口
const server = app.listen(8888, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log('连接成功', host, port);
});

// get req.query.id
// post req.body.id