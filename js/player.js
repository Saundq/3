var AudioContext,
    SourceIN,
    isPlaying = false,
	PATH,
	myBuffers = {},
	myNodes = {};
var reader = new FileReader();


 var canvasCtx = example.getContext('2d');
var WIDTH=300;
var HEIGHT=100;
canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

 reader.onloadend = function (loadEvent) { 
		    PATH =  loadEvent.target.result;	
	
			console.log(PATH+" путь");
			fetchSounds(PATH);
			
       }
	
function init() {
	
				window.AudioContext = window.AudioContext||window.webkitAudioContext;
				AudioContext = new AudioContext();
				 analyser = AudioContext.createAnalyser();
				 analyser.fftSize = 2048;
				 analyser.connect(AudioContext.destination);
				var inputs = [];
	  var inputs = validateParam({
      audio: '.audio',

      container: '.eq-wrap'
    });
				initInputsData(inputs);
				initEvents(inputs);
		
        }
function fetchSounds(P) {
            var request = new XMLHttpRequest();
			console.log(P+" Пэшечка");
           
                request.open('GET', P , true);
                request.responseType = 'arraybuffer';
				request.onload = function() {
					AudioContext.decodeAudioData(request.response, function(response) {
					var buffer = response;
					 myBuffers[0] = buffer;
					//console.log(myBuffers[0]);
					playSound();
					isPlaying=true;
					document.getElementById('plbtn').value="Stop";
			 }, function () { console.error('The request failed.'); } );
				}
                request.send();

        }
function routeSound(source) {
	source.connect(AudioContext.destination);
	source.connect(analyser);
	
	


	
	filters = createFilters();
	source.connect(filters[0]);
	filters[filters.length - 1].connect(AudioContext.destination);
   
            return source;
        }
 function playSound() {
           var source = AudioContext.createBufferSource();
		  
            source.buffer = myBuffers[0]; 
            source.loop = true;
            source = routeSound(source);
		    source.start(0);
            SourceIN = source;
			draw(analyser);
        }
 
function pauseSound() {
            var source = SourceIN;
            source.stop(0);
            //clearInterval(mySpectrum);
        }
 
function toggleSound(button) {
            if(!isPlaying) {
                playSound();
                button.value = "Stop";
                isPlaying = true;
            }
            else {
                pauseSound();
                button.value = "Play";
                isPlaying = false;
            }
        }
function getmetadata(ff) {
	var file = ff,
        url = file.urn || file.name;

      ID3.loadTags(url, function() {
        showTags(url);
      }, {
        tags: ["title","artist","album","track"],
        dataReader: FileAPIReader(file)
      });
}
function isEmptyObject(obj){
        var name;
        for(name in obj) {
                return false;
        }
        return true;
}
 function showTags(url) {
      var tags = ID3.getAllTags(url);
	  if (isEmptyObject(tags)!=true)
		  {document.getElementById('title').textContent = tags.title || "";
		  document.getElementById('artist').textContent = tags.artist || "";
		  document.getElementById('album').textContent = tags.album || "";
		  console.log(tags.track || "");
	  } else document.getElementById('ssong').textContent = url ;
    
    }

var $$ = document.querySelectorAll.bind(document),
    $ = document.querySelector.bind(document);
function createInputs(className, container) {
      var inputs = [],
        node,
        i;
      
      for (i = 0; i < 10; i++) {
        node = document.createElement('input');
        // remove dot
        node.className = className.slice(1);
        container.appendChild(node);
        inputs.push(node);
      }
      
      return inputs;
    }
function validateParam (param) {
      if (!param) {
        throw new TypeError('equalizer: param required');
      }
      
      var container = $(param.container),
        inputs = $$(param.inputs);
      
      
 
      
      if (!container && !inputs.length) {
        throw new TypeError('equalizer: there\'s no elements match "' +
          param.container + '" or "' + param.selector);
      }
      
      if (!inputs.length) {
        inputs = createInputs(param.selector || '', container);
      }
      
      return inputs;
    }
function createFilter(frequency) {
  var filter = AudioContext.createBiquadFilter();
     
  filter.type = 'peaking'; // тип фильтра
  filter.frequency.value = frequency; // частота
  filter.Q.value = 1; // Q-factor
  filter.gain.value = 0;

  return filter;
}
function createFilters() {
  var frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000],
    filters = frequencies.map(createFilter);

  filters.reduce(function (prev, curr) {
    prev.connect(curr);
    return curr;
  });

  return filters;
};
    /**
     * init inputs range and step
     */
function initInputsData(inputs) {
	k=0;
      [].forEach.call(inputs, function (item) {
        item.setAttribute('min', -16);
        item.setAttribute('max', 16);
        item.setAttribute('step', 0.1);
        item.setAttribute('value', 0);
		item.setAttribute('class', 'inprang');
		item.setAttribute('id', 'inprang'+k);
        item.setAttribute('type', 'range');
		k++;
      });
    }
function initEvents(inputs) {
      [].forEach.call(inputs, function (item, i) {
        item.addEventListener('change', function (e) {
          filters[i].gain.value = e.target.value;
        }, false);
      });
    };
function preset(name){
	console.log(name);
	presets={'rock':[-7.9,4.8,-5.5,-7.9,-3.2,3.9,8.8,11.1,11.1,11.1],
			 'pop':[-1.6,4.8,7.1,7.9,5.5,0,-2.4,-2.4,-1.6,-1.6],
			 'jazz':[0,0,0,3,3,3,0,2,0,4],
			 'classic':[0,0,0,0,0,0,-7.1,-7.1,-7.1,-9.6],
			 'normal':[0,0,0,0,0,0,0,0,0,0]
	};
	for(i=0;i<10;i++)
	{
		it=document.getElementById('inprang'+i);	
		it.value=presets[name][i];
		filters[i].gain.value = presets[name][i];
	}

}
function draw() {
	var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
drawVisual = requestAnimationFrame(draw);
analyser.getByteTimeDomainData(dataArray);
canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
	  canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();
	  
	  var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;
	 
	 for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }
	  canvasCtx.lineTo(canvasCtx.width, canvasCtx.height/2);
      canvasCtx.stroke();
    };
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;
	reader.readAsDataURL(files[0]);
	getmetadata(files[0]);
	
}
function handleDragOver(evt) {
			evt.stopPropagation();
			evt.preventDefault();
			evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
         }

  // Setup the dnd listeners.
  
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
  
  