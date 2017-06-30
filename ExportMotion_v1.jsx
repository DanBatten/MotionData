//exports layer name, property, value, and anim timing for keyframed layers.
//Used to output to a motion guidline doc.


clearOutput();


//GLOBALS

var activeCompName, activeComp, fps, timeMS, compAnimStart, compAnimDur, writeString,testString,editText;
var space = " ";
var lineReturn = "\r\n";
var paragraph = "\r\n\r\n";
var lineTab = "\t";
var activeItem = app.project.activeItem;
var writeIndex = '';
var moGuideInstructions = "Comp in and out defines timeframe" + lineReturn + "Use 50fps Comp for clean values" + lineReturn + "NAME YOUR LAYERS";
var trackDataInstructions = "Select layers you would like to export";
var exportPathInstructions = "Export Shape paths and animation as SVG's";

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
	
	if(activeItem != null && (activeItem instanceof CompItem)){
		
		writeString = "";
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
							writeString += "Stroke Color: " + property.property(a).value.toString() + lineReturn ;
						}
						if(property.property(a).name === "Stroke Width"){
							writeString += "Stroke width: " + property.property(a).value.toString() + lineReturn;
						}
					}
				}
			    if (property.propertyType == PropertyType.PROPERTY && property.name === "Path"){
			    	 writeString += selectedLayers[i].name + lineReturn;
			    	 //writeString += property.value.isClosed + lineReturn;
			    	 writeString += "Vertices" + lineReturn;
			    	for (var j = 0; j < property.value.vertices.length; j++) {
			    		writeString += "(";
			    		if(property.value.vertices[j][0]){
			    			
			    			for (var q = 0; q < property.value.vertices[j].length; q++) {
			    				
			    				if(q % 2 === 0){
			    					writeString += Math.round(property.value.vertices[j][q]) + ",";
			    				}else{
			    					writeString += Math.round(property.value.vertices[j][q]) + ")" + lineReturn;
			    				}
			    			}
			    		}	
			    	}
			    	 writeString += "in Tangents" + lineReturn;
			    	for (var j = 0; j < property.value.inTangents.length; j++) {
			    		writeString += "(";
			    		if(property.value.inTangents[j][0]){
			    			
			    			for (var q = 0; q < property.value.inTangents[j].length; q++) {
			    				
			    				if(q % 2 === 0){
			    					writeString += Math.round(property.value.inTangents[j][q]) + ",";
			    				}else{
			    					writeString += Math.round(property.value.inTangents[j][q]) + ")" + lineReturn;
			    				}
			    			}
			    		}	
			    	}
			    	 writeString += "out Tangents" + lineReturn;
			    	for (var j = 0; j < property.value.outTangents.length; j++) {
			    		writeString += "(";
			    		if(property.value.outTangents[j][0]){
			    			
			    			for (var q = 0; q < property.value.outTangents[j].length; q++) {
			    				
			    				if(q % 2 === 0){
			    					writeString += Math.round(property.value.outTangents[j][q]) + ",";
			    				}else{
			    					writeString += Math.round(property.value.outTangents[j][q]) + ")" + lineReturn;
			    				}
			    			}
			    		}	
			    	}
			    	// writeString += "found the fucking path " + property.value.vertices.length;
			    }
			 
			   
			    if (property.propertyType == PropertyType.INDEXED_GROUP || property.propertyType == PropertyType.NAMED_GROUP) {
			        
			        for (var d = 1; d <= property.numProperties; d++) {
			        	findPath(property.property(d));
			        }
			    }
			
			}
			
			

			// function findPath(layer){
				
				
			// 	if(layer instanceof ShapeLayer){	

			// 		var contents = layer.property("ADBE Root Vectors Group");

					
			// 		writeString += "SHAPE: " + layer.name + lineReturn;
			// 		writeString += contents.property(1).property(4).name;
			// 		while(contents){

			// 			contents = walkProperties(contents);
			// 			writeString += contents.name + lineReturn;
			// 		}
				
				
			// 	}else{
			// 		writeString += Layer.name + " is not a shape layer" + lineReturn;
			// 	}


				
			// }
			checkLayer(activeComp);
		}
		editText.text = writeString;
	}

}







