
/*
 * 설정
 */
			   
var property = require("./property"); 
module.exports = {
	server_port: property.server_port,
	route_info:[
			{file:'../src/routes/main', path:'/', method:'main', type:'get'},
			{file:'../src/routes/main', path:'/result', method:'result', type:'get'},

			//파일 업로드
			{file:'../src/routes/utils/fileManager', path:'/uploadFile', method:'uploadFile', type:'post'}

			
	]
}
