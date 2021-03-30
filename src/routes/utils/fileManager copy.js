/*
 * fileManager
 * @date 2020-05-26
 * @author Chung10 
 */
var multiparty = require('multiparty');
var fs = require('fs');
var path = require('path');
var os = require('os');
var moment = require('moment');
const desktopPath = path.join(os.homedir(), 'desktop');

var uploadFile = async function (req, res) {
  
  var uploadPath = path.join(desktopPath, 'picture');
  !fs.existsSync(uploadPath)&&fs.mkdirSync(uploadPath);

  var returnPath='';

  console.log(req.query || req.body)
  let options = {
    autoFields : false
  }
  var form = new multiparty.Form();
  
  
  // get field name & value
  var folders = "";
  form.on('field',function(name,value){
    if(name === "chkList"){
      folders = value;
    };
  });
  

  var filenames = [];
  var fullpaths = [];
  // file upload handling
  form.on('part',function(part){
      
      var filename;
      var size;
      
      if (part.filename) {
            filename = part.filename;
            size = part.byteCount;
      }else{
            part.resume();
      };
      console.log("!!!!!!!!!!!!!")
      console.log( part.folders )
      console.log( part.field )
      console.log( folders  )
      console.log( filename )
      console.log("!!!!!!!!!!!!!")
      filenames.push(filename);
      //폴더 생성
      dir = uploadPath;
      var paths = [moment().format("YYYY")  , moment().format("MM") , moment().format("DD")  ];
      for(var i=0; i < 3 ; i++){
        dir = path.join(dir , paths[0] );
        returnPath = path.join(returnPath , paths[0] );
        paths.splice(0,1);
        !fs.existsSync(dir)&&fs.mkdirSync(dir);
        
      };
      returnPath = path.join(returnPath , filename );
      
       var fullpath = path.join(dir , filename);
       var writeStream = fs.createWriteStream(fullpath);
       fullpaths.push(fullpath);
       writeStream.filename = filename;
       part.pipe(writeStream);

       part.on('data',function(chunk){
       });
       part.on('end',function(){
             writeStream.end();
       });
       
  });
  // all uploads are completed
  form.on('close',function(){
      res.status(200).send({"result" : true });
  });
  // track progress
  form.on('progress',function(byteRead,byteExpected){
    
  });
  form.parse(req);
};

    


module.exports.uploadFile = uploadFile;




