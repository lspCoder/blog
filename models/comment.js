var mongodb = require('./db');

function Comment(name,day,title,comment){
	this.name = name,
	this.day = day,
	this.title = title,
	this.comment = comment;
}

module.exports = Comment;

//存储一条留言信息
Comment.prototype.save = function(callback){
	var name = this.name,
		day = this.day,
		title = this.title,
		comment = this.comment;
	//打开数据库连接
	mongodb.open(function(err,db){
		if(err){
			mongodb.close();
			return callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//通过用户名,时间及标题查找文档，并把一条留言对象添加到该文档的comments数组里
			collection.update({
				"name":name,
				"time.day":day,
				"title":title
			},{
				$push:{"comments":comment}   //{$push:{field:value}};把value追加到field里。注：field只能是数组类型，如果field不存在，会自动插入一个数组类型
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
		})
	})	
}