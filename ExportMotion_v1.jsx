//exports layer name, property, value, and anim timing for keyframed layers.
//Used to output to a motion guidline doc.


clearOutput();


//GLOBALS

var activeCompName, activeComp, fps, timeMS, compAnimStart, compAnimDur, writeString,testString,editText;
var space = ' ';
var lineReturn = '\r\n';
var paragraph = '\r\n\r\n';
var lineTab = '\t';
var activeItem = app.project.activeItem;
var writeIndex = ''
var moGuideInstructions = 'Comp in and out defines timeframe' + lineReturn + 'Use 50fps Comp for clean values' + lineReturn + 'NAME YOUR LAYERS';
var trackDataInstructions = 'Select layers you would like to export'
var exportPathInstructions = 'Export Shape paths and animation as SVGs';

//CREATE UI

function InitUI (that){
	var myWin = (that instanceof Panel) ? that : new Window("palette", "Create Motion Guidelines",undefined,{resizeable:true});
	var selectGroup = myWin.add("group",undefined,"SelectGroup");
	var selectGroup2 = myWin.add("group",undefined,"SelectGroup2");
	selectGroup.orientation = "row";
	selectGroup2.orientation = "row";
	var groupOne = myWin.add("group",undefined,"GroupOne");
	groupOne.orientation = "column";
	var radioButton1 = selectGroup.add("radioButton", undefined, "Motion Guidelines");
	var radioButton2 = selectGroup.add("radioButton", undefined, "Tracking data");
	var radioButton3 = selectGroup.add("radioButton", undefined, "Export Shape");
	var description = groupOne.add("staticText",[0,0,250,50],"Hello World",{multiline:true});
	var buttonGroup = groupOne.add("group",undefined,"buttonGroup");
	buttonGroup.orientation = "row";
	var executeButton = buttonGroup.add("button", [0,0,85,30], "Execute");
	var clearButton = buttonGroup.add("button", [0,0,85,30], "Clear");
	editText = groupOne.add("edittext",[0,0,300,300],"Hello World",{multiline:true,resizeable:true});

	radioButton1.value = true;

	
	description.text = moGuideInstructions;

	myWin.layout.layout(true);

	radioButton1.onClick = function(){
		description.text = moGuideInstructions;
	}
	radioButton2.onClick = function(){
		description.text = trackDataInstructions;
	}
	radioButton3.onClick = function(){
		description.text = exportPathInstructions;
	}
	clearButton.onClick = function(){
		
		editText.text = "Hello World";
	}

	executeButton.onClick = function(){
		if (radioButton1.value){
			printMotionGuidelines();
		}
		if (radioButton2.value){
			printTrackingData();
		}
		if (radioButton3.value){
			exportPaths();

		}	
	}
}

InitUI(this);

//HELPERS

//polyfill
Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
};
function adjustZero(x,y){
	var array = [];
	array.push(x+(activeItem.width/2));
	array.push(y+(activeItem.height/2));
	return array  
}
function adjustTangent(vertice,tang){
	var result = [];
	result.push(vertice[0] + tang[0]);
	result.push(vertice[1] + tang[1]);
	// for (var i = 0; i < vertice.length; i++) {
	// 	result.push(vertice[i] + tang[i]);
	// }
	return result
}


//EXECUTE FUNCTIONS

function printMotionGuidelines (){
	
	if (activeItem != null && (activeItem instanceof CompItem)){
		testString = "";
		writeString = "";
		activeComp = activeItem;
		activeCompName = activeComp.name;
		fps = activeComp.frameRate;
		timeMS = activeComp.time * 1000;
		compAnimStart = activeComp.workAreaStart * 1000;
		compAnimDur = activeComp.workAreaDuration * 1000;

		writeString = activeCompName + lineReturn + "Total Anim time " + compAnimDur + "MS" + lineReturn;
		
		
		var selectedLayers = activeComp.layers;

		
		for (var i = 1; i <= selectedLayers.length; i++) {
			writeString += paragraph + selectedLayers[i].name;
			var numProps = selectedLayers[i].numProperties;

			
			
			function findProperties(curItem) {
			    var curLayer = selectedLayers[i];
			    var report = "";

			    findKeys(curLayer);
			    
			    return
			}
			 
			function findKeys(property) {
			   
			    
			    var propTypeString = "Unknown";
			    if (property.propertyType == PropertyType.INDEXED_GROUP) { propTypeString = "INDEXED_GROUP"; }
			    else if (property.propertyType == PropertyType.NAMED_GROUP) { propTypeString = "NAMED_GROUP"; }
			    else if (property.propertyType == PropertyType.PROPERTY) { propTypeString = "PROPERTY";  }
			 
			    
			
			    if (property.propertyType == PropertyType.PROPERTY && property.canVaryOverTime && property.numKeys > 0){
			    	
			    	writeString += lineReturn + property.name + lineReturn;
			    	for (var j = 1; j <= property.numKeys; j++) {
			    		
			    		var t = (property.keyTime(j) * 1000) - compAnimStart;
			    		var keyValue = [];
			    		if(property.keyValue(j)[0]){
			    			for (var x = 0; x < property.keyValue(j).length; x++) {
				    			keyValue.push(property.keyValue(j)[x].toFixed(0));
				    		}
			    		}else{
			    			keyValue.push(property.keyValue(j));
			    		}
			    		
			    		writeString += t.toString() + "MS " + " - " + keyValue.toString() + lineReturn;
			    		if(j % 2 === 0){

			    			if(Number.isInteger(property.keyValue(j)) || Number.isInteger(property.keyValue(j)[0]) ){
				    			var x1,x2,y1,y2;
				    			var t1 = property.keyTime(j-1);
				    			var t2 = property.keyTime(j);
				    			if (Number.isInteger(property.keyValue(j)[0])){
				    				var val1 = property.keyValue(j-1)[0] + property.keyValue(j-1)[1];
									var val2 = property.keyValue(j)[0] + property.keyValue(j)[1];
									if(property.keyValue(j)[2]){
										val1 += property.keyValue(j-1)[2];
										val2 += property.keyValue(j)[2];
									}
				    			}else{
				    				var val1 = property.keyValue(j-1);
									var val2 = property.keyValue(j);
				    			}

								
								var delta_t = t2-t1;
								var delta = val2-val1;
								var avSpeed = Math.abs(val2-val1)/(t2-t1);
								 
								if (val1<val2){    
									x1 = property.keyOutTemporalEase(j-1)[0].influence /100;
									y1 = x1*property.keyOutTemporalEase(j-1)[0].speed / avSpeed;
									     
									x2 = 1-property.keyInTemporalEase(j)[0].influence /100;
									y2 = 1-(1-x2)*(property.keyInTemporalEase(j)[0].speed / avSpeed);
								}
								if (val2<val1){
									x1 = property.keyOutTemporalEase(j-1)[0].influence /100;
									y1 = (-x1)*property.keyOutTemporalEase(j-1)[0].speed / avSpeed;
									x2 = property.keyInTemporalEase(j)[0].influence /100;
									y2 = 1+x2*(property.keyInTemporalEase(j)[0].speed / avSpeed);
									x2 = 1-x2;
								}
								if (val1==val2){
									x1 = property.keyOutTemporalEase(j-1)[0].influence /100;
									y1 = (-x1)*property.keyOutTemporalEase(j-1)[0].speed / ((property.maxValue-property.minValue)/(t2-t1)) ;
									x2 = property.keyInTemporalEase(j)[0].influence /100;
									y2 = 1+x2*(property.keyInTemporalEase(j)[0].speed / ((property.maxValue-property.minValue)/(t2-t1)));
									x2 = 1-x2;
								}
								if (x1 === y1 && x2 === y2){
									writeString += "Linear";
								}else{
									writeString += "Cubic-bezier(" + x1.toFixed(2) + ", " + y1.toFixed(2) + ", " + x2.toFixed(2) + ", " + y2.toFixed(2)  + ")" + lineReturn;
								}

							}else{
								writeString += "Can't calculate bezier on path anim" + lineReturn;
							}
			    			
			    		}
			    	}
			    	
			    }
			 
			   
			    if (property.propertyType == PropertyType.INDEXED_GROUP || property.propertyType == PropertyType.NAMED_GROUP) {
			        
			        for (var d = 1; d <= property.numProperties; d++) {
			        	findKeys(property.property(d));
			        }
			    }
			
			}
			writeString += paragraph;
			findProperties(activeComp);
			 
			
		

			
		}
		
		editText.text = writeString;
	}
}

function printTrackingData (){
	
	if (activeItem != null && (activeItem instanceof CompItem)){
		testString = "";
		writeString = '';
		writeIndex = '// FILE CONTAINS THE FOLLOWING:'
		activeComp = activeItem;
		activeCompName = activeComp.name;
		fps = activeComp.frameRate;
		timeMS = activeComp.time * 1000;
		compAnimStart = activeComp.workAreaStart * 1000;
		compAnimDur = activeComp.workAreaDuration * 1000;

		//writeString = activeCompName + "Track{ ";
		
		
		var selectedLayers = activeComp.layers;
		
		
		for (var i = 1; i <= selectedLayers.length; i++) {
			// writeString += lineReturn + selectedLayers[i].name;
			var numProps = selectedLayers[i].numProperties;

			

			function findProperties(curItem) {
			    var curLayer = selectedLayers[i];
			    var report = "";

			    findKeys(curLayer);
			    //alert(report);
			    return
			}
			 
			function findKeys(property) {
			   
			   
			    var propTypeString = "Unknown";
			    if (property.propertyType == PropertyType.INDEXED_GROUP) { propTypeString = "INDEXED_GROUP"; }
			    else if (property.propertyType == PropertyType.NAMED_GROUP) { propTypeString = "NAMED_GROUP"; }
			    else if (property.propertyType == PropertyType.PROPERTY) { propTypeString = "PROPERTY";  }
			 
			    
			
			    if (property.propertyType == PropertyType.PROPERTY && property.canVaryOverTime && property.numKeys > 0){
			    	writeString += lineReturn + selectedLayers[i].name;
			    	writeString += property.name + ' = {';
			    	writeIndex += lineReturn + '// ' + selectedLayers[i].name + property.name;
			    	for (var j = 1; j <= property.numKeys; j++) {
			    		var t = (property.keyTime(j) * 1000) - compAnimStart;
			    		var frameCounter = j-1;
			    		if(property.keyValue(j)[0]){
			    			writeString += lineReturn + lineTab  + frameCounter.toString() + ': [' + property.keyValue(j)[0].toString() + ", " + property.keyValue(j)[1].toString() + ", " + property.keyValue(j)[2].toString() + '],';
			    		}else{
			    			writeString += lineReturn + lineTab  + frameCounter.toString() + ': [' + property.keyValue(j).toString() + '],';
			    		}
			    		
			    	}
			    	writeString = writeString.slice(0,-1);
			    	writeString += lineReturn + '}' + lineReturn;
			    }
			 
			   
			    if (property.propertyType == PropertyType.INDEXED_GROUP || property.propertyType == PropertyType.NAMED_GROUP) {
			        
			        for (var d = 1; d <= property.numProperties; d++) {
			        	findKeys(property.property(d));
			        }
			    }
			
			}
			
			findProperties(activeComp);
			 
			
		

			
		}
		
		editText.text = writeIndex + lineReturn + writeString;
	}
	
}

function exportPaths (){
	var fillColor, strokeColor, strokeWidth, isClosed, pathID, shapeLayerName;
	var inTang = [];
	var outTang = [];
	var coOrds = [];
	
	if(activeItem != null && (activeItem instanceof CompItem)){
		
		writeString = '';
		activeComp = activeItem;
		
		activeCompName = activeComp.name;
		fps = activeComp.time * 1000;
		compAnimStart = activeComp.workAreaStart * 1000;
		compAnimDur = activeComp.workAreaDuration * 1000;

		var selectedLayers = activeComp.layers;

		


		for(var i = 1; i <= selectedLayers.length; i++){


			function checkLayer(curItem) {
			    var curLayer = selectedLayers[i];
			    if(curLayer instanceof ShapeLayer){
			    	findPath(curLayer);
			    }
			    
			    return
			}

			function findPath(property) {
			   
			   
			    var propTypeString = "Unknown";
			    if (property.propertyType == PropertyType.INDEXED_GROUP) { propTypeString = "INDEXED_GROUP"; }
			    else if (property.propertyType == PropertyType.NAMED_GROUP) { propTypeString = "NAMED_GROUP"; }
			    else if (property.propertyType == PropertyType.PROPERTY) { propTypeString = "PROPERTY";  }
			 	
			 	if(property instanceof ShapeLayer){
			 		shapeLayerName = property.name;
			 	}
			   	
				var isFill = /^Fill/.test(property.name);
				if(isFill && (property.propertyType == PropertyType.INDEXED_GROUP || property.propertyType == PropertyType.NAMED_GROUP)){
					for (var a = 1; a < property.numProperties; a++) {
						if(property.property(a).name === "Color"){
							fillColor = property.property(a).value;
						}
					}
				}
				var isStroke = /^Stroke/.test(property.name);
				if(isStroke && (property.propertyType == PropertyType.INDEXED_GROUP || property.propertyType == PropertyType.NAMED_GROUP)){
					for (var a = 1; a < property.numProperties; a++) {
						if(property.property(a).name === "Color"){
							strokeColor  = property.property(a).value;
						}else{
							strokeColor = 'none';
						}
						if(property.property(a).name === "Stroke Width"){
							strokeWidth = property.property(a).value;
						}else{
							strokeWidth = 'none';
						}
					}
				}

			    if (property.propertyType == PropertyType.PROPERTY && property.name === "Path"){
			    	 writeString += selectedLayers[i].name + lineReturn;
			    	 //writeString += property.value.isClosed + lineReturn;
			    	 //writeString += 'Vertices' + lineReturn;
			    	for (var j = 0; j < property.value.vertices.length; j++) {

			    		coOrds.push(property.value.vertices[j]);
			    		if(property.value.inTangents[j]){
			    			var adjustIn = adjustTangent(property.value.vertices[j],property.value.inTangents[j]);
			    			inTang.push(adjustIn);
			    		}else{
			    			inTang.push(null);
			    		}

			    		if(property.value.outTangents[j]){
			    			var adjustOut = adjustTangent(property.value.vertices[j],property.value.outTangents[j]);
			    			outTang.push(adjustOut);
			    		}else{
			    			outTang.push(null);
			    		}
			    		
			    	}
			    	
			    	
			    }
			 
			   
			    if (property.propertyType == PropertyType.INDEXED_GROUP || property.propertyType == PropertyType.NAMED_GROUP) {
			        
			        for (var d = 1; d <= property.numProperties; d++) {
			        	findPath(property.property(d));
			        }
			    }
			
			}
			
			

			
			checkLayer(activeComp);
		}
		writeString += '<g id="' + activeCompName + '" stroke="' + strokeColor.toString() + '" stroke-width="' + strokeWidth.toString() + '" fill="' + fillColor.toString() + '" fill-rule="evenodd">' + lineReturn;
		writeString += lineTab + '<path id="' + shapeLayerName + '" d="M';
		var firstCoORd;
		for (var i = 0; i < coOrds.length; i++) {
			var newCoords,newIn,newOut;
			newCoords = adjustZero(Math.round(coOrds[i][0]),Math.round(coOrds[i][1]));
			newOut = adjustZero(Math.round(outTang[i][0]),Math.round(outTang[i][1]));
			if(i === coOrds.length - 1){
				newIn = adjustZero(Math.round(inTang[0][0]),Math.round(inTang[0][1]));
			}else{
				newIn = adjustZero(Math.round(inTang[i+1][0]),Math.round(inTang[i+1][1]));
			}
			

			if(i === 0){
				firstCoORd = newCoords[0].toString() + ',' + newCoords[1].toString() + " ";
			}
			writeString += newCoords[0].toString() + ',' + newCoords[1].toString() + " ";
			writeString += 'C' + newOut[0].toString() + ',' + newOut[1].toString() + " ";
			writeString += newIn[0].toString() + ',' + newIn[1].toString() + " ";
			if(i === coOrds.length - 1){
				writeString += firstCoORd;
			}
			
			
			
		}
		writeString += 'Z"';
		writeString += '></path>';
		editText.text = writeString;
	}

}







