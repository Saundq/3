console.log("Привет");
var BUFFERS = {};
var k=0;
var createContext = function () {
     // var previous = window.equalizer;
  
      // avoid multiple AudioContext creating
     // if (previous && previous.context) {
      //  context = previous.context;
     // } else {
       // context = new AudioContext();
    //  }
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
     context = new AudioContext();
    },
	playPause = function() {
		  if (!context.createGain)
			context.createGain = context.createGainNode;
		  this.gainNode = context.createGain();
		  var source = context.createBufferSource();
		//  console.log("Тут файл "+file);
		  //context.decodeAudioData(files,function(files) {
		//	//  source.buffer = files;
		  //});
		  console.log(BUFFERS);
		 // for (i=0;i<BUFFERS.length;i++)
		 // {
			  
		 // }
		 // for(var name in BUFFERS)
			source.buffer = BUFFERS['kle'];

		  // Connect source to a gain node
		  source.connect(this.gainNode);
		  // Connect gain node to destination
		  this.gainNode.connect(context.destination);
		  // Start playback in a loop
		  source.loop = true;
		  if (!source.start)
			source.start = source.noteOn;
		  source.start(0);
		  this.source = source;
},
 pauseSound = function() {
            var source = source;
            source.noteOff(0);
            clearInterval(mySpectrum);
        }
	
	/*playPause = function (bufferList) {
		var source = context.createBufferSource();
		source.buffer = bufferList;//bufferList[0];
		source.connect(context.destination);
		source.start(0);
	},*/
	initEventLoadSound = function (id_item) {
		//item=document.getElementById(id_item)
		item=document.querySelector("input");
		console.log(" Инициализация прослушивания загрузки файла в поле");
		item.addEventListener('change', function () {
			console.log(this);
			 //file = this.files[0];//.value;
			 loadBuffers(this.files);
			 //console.log(file);
			// reader = new FileReader();
			// reader.onloadend = function (e) {
				// loadBuffers(e);
			//	 filesq =reader.result;
   // console.log(reader.result);
  //}

  //reader.readAsBinaryString(blob);
			//filesq = reader.readAsDataURL(file);//reader.readAsBinaryString(file);
			
		});
				//}(ffile); 
        //}, false);
	};
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}
BufferLoader.prototype.loadBuffer = function(url) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
	  
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
		 
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList = buffer;
        //if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}
BufferLoader.prototype.load = function() {
 // for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList, 0);
}
 var readerN = new FileReader();
// fileRead = [];
 var paths = [];
 var ind=0;
function readFiles(files) {
   //if (files.length != ind) { // if we still have files left
   console.log(files.length);
   console.log(files[0]);
       var file = files[0];//shift(); // remove first from queue and store in file
		//delete files[0]; 
		//ind++;
       readerN.onloadend = function (loadEvent) { // when finished reading file, call recursive readFiles function
           //fileRead.push(loadEvent.target.result);
		   var path =  loadEvent.target.result;//files.name;			
					paths.push(path);
					console.log(paths+" пути");
					//bufferLoader.load();
					bufferLoader.load(); 
           //readFiles(files);
       }
       readerN.readAsDataURL(file);
	  

   } //else {
	  
      // finishedReadingFiles() // no more files to read
  // }//
//}

function loadBuffers(files) {
  // Array-ify
  var names = [];
  
  
 
  /*readerN.onload= function (e) {
	 // console.log(e.target.result);
				 var path =  e.target.result;//files.name;			
					paths.push(path);
					console.log(paths+" пути");
					bufferLoader.load();
			 }*/
  console.log("Длина "+files.length)
 // for (i=0;i< files.length ;i++) {
	  
	  names.push(files[0].name.replace(/\./gi, ""));
	  
      //readerN.readAsDataURL(files[i]);
 //} 
 readFiles(files) ;
  
  
  
  console.log(names+" имена");
 //console.log(bufferList+ "буферлист");
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
	   console.log("тут все ок");
	   console.log(bufferList.length+ "буферлист");
    //for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList//[i];
      //var name = names[i];
      BUFFERS['kle'] = buffer;
   // }
  });
 // bufferLoader.load(); 
}

	
	
	createContext();
	initEventLoadSound("files");
	//playPause();
	//createContext();
	
	