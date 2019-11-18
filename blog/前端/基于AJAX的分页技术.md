| 题目               | 创建时间            | 标签            |
| ------------------ | ------------------- | --------------- |
| 基于AJAX的分页技术 | 2018-01-18 23:20:25 | 前端/JavaScript |

------

## 为何要分页

分页可以从以下三个方面考虑

* 用户体验
* 数据传输量
* 数据查询效率

三种实现思路：
* 一次性查询所有数据回来，使用JS进行分页（假分页）
	* 缺点：无法实时；数据量大。
	* 优点：换页时不需要再次查询，只需进行JS操作。
* 一次性查询所有数据，在处理RS时只获取当前页数据
	* 缺点：每次都要查询全部的数据。
	* 优点：能实时；数据量少。
* 根据数据总条数算出页数，再按照页数和每页数据量分批查询
	* 缺点：要设计者自己计算和设计SQL语句。
	* 优点：实时；数据量少；效率高。

常见的分页SQL语句：
* `SELECT count(*) FROM "TABLE";`
* `SELECT * FROM "TABLE" LIMIT n,m;`

## 分页技术的具体实现

分批查询：

``` Java
int pages = 0;
int count=0;
int totalpages=0;
int limit=10;
Class.forName("com.mysql.jdbc.Driver");
Connection sqlCon = java.sql.DriverManager.getConnection("jdbc:mysql://localhost:3306/demo_page", "root", "root");
Statement sqlStmt = sqlCon.createStatement();
ResultSet sqlRst = sqlStmt.executeQuery("select count(*) from user");
if(sqlRst.next()){
	count = sqlRst.getInt(1);
}
totalpages = (int)Math.ceil(count/(limit*1.0));
String strPage = request.getParameter("pages");
if (strPage == null) { 
	pages = 1;
} else {
	try{
		pages = java.lang.Integer.parseInt(strPage);
	}catch(Exception e){
		pages = 1;
	}
	if (pages < 1){
		pages = 1;
	} else if (pages > totalpages){
		pages = totalpages;
	}
}
sqlRst = sqlStmt.executeQuery("select * from user order by user_id limit " + (pages - 1) * limit + "," + limit);
while (sqlRst.next()){
	...
}
```

