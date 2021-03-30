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
  const folderNm = moment().format("YYYYMMDDHHMMSS");  
  const folderNm2 = moment().format("YYYYMMDD");  
  var returnPath='';
  
  var form = new multiparty.Form();
  
  
  // get field name & value
  var folders = [];
  form.on('field',function(name,value){
    if(name === "chkList"){
      folders.push(value);
    };
  });
  
  // file upload handling
  var filepPaths = [];
  var filenames = [];
  form.on('part',function(part){
    
      var filename;
      var size;
      
      if (part.filename) {
            filename = part.filename;
            size = part.byteCount;
      }else{
            part.resume();
      };

      //폴더 생성
      dir = desktopPath;
      var paths = [ folderNm , "originalData" ];
      for(var i=0; i < 2 ; i++){
        dir = path.join(dir , paths[0] );
        returnPath = path.join(returnPath , paths[0] );
        paths.splice(0,1);
        !fs.existsSync(dir)&&fs.mkdirSync(dir);
      };
      returnPath = path.join(returnPath , filename );

       var fullpath = path.join(dir , filename);
       filepPaths.push(fullpath);
       filenames.push(filename);
       

       var writeStream = fs.createWriteStream(fullpath);
       writeStream.filename = filename;
       part.pipe(writeStream);

       part.on('data',function(chunk){});
       part.on('end',function(){
             writeStream.end();
       });
       
  });
  
  // all uploads are completed
  form.on('close',function(){

      for( var i=0 ; i < filepPaths.length ; i++ ){
        
        input = fs.createReadStream( filepPaths[i] );
        fols = folders[i].split(",");

        //빈칸제거
        fols = fols.filter(function(data){
            if( gfnCheckNull(data) != ""){
                return gfnCheckNull(data);
            };
        });

        for( var z=0 ; z < fols.length ; z++ ){
          
          copyPath = path.join(desktopPath , folderNm );
          copyPath = path.join(copyPath , fols[z] );
          !fs.existsSync(copyPath)&&fs.mkdirSync(copyPath);
          copyFnm = path.join( copyPath , filenames[i] );
          output = fs.createWriteStream ( copyFnm );
          input.pipe(output);
        };

      };
      res.status(200).send({"result" : true });
  });

  // track progress
  form.on('progress',function(byteRead,byteExpected){});
  form.parse(req);
  
};

function gfnCheckNull(data , chr){
  if(chr == null || chr == undefined) chr ='';
  
  if(data == null || data == undefined || data== 'null'|| data === ''){
      return chr;
  }else{
      return data;
  }   
}

module.exports.uploadFile = uploadFile;




