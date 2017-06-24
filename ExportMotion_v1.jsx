//exports layer name, property, value, and anim timing for keyframed layers.
//Used to output to a motion guidline doc.


clearOutput();

var activeCompName, activeComp, fps, timeMS, compAnimStart, compAnimDur, writeString,testString,editText;
var space = " ";
var lineReturn = "\r\n";
var paragraph = "\r\n\r\n";
var lineTab = "\t";
var activeItem = app.project.activeItem;
var writeIndex = '';
var moGuideInstructions = "Comp in and out defines timeframe" + lineReturn + "Use 50fps Comp for clean values" + lineReturn + "NAME YOUR LAYERS";
var trackDataInstructions = "Select layers you would like to export";

function InitUI (that){
	var myWin = (that instanceof Panel) ? that : new Window("palette", "Create Motion Guidelines",undefined,{resizeable:true});
	var selectGroup = myWin.add("group",undefined,"SelectGroup");
	selectGroup.orientation = "row";
	var groupOne = myWin.add("group",undefined,"GroupOne");
	groupOne.orientation = "column";
	var radioButton1 = selectGroup.add("radioButton", undefined, "Motion Guidelines");
	var radioButton2 = selectGroup.add("radioButton", undefined, "Tracking data");
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
		
	}
}

InitUI(this);








Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
};

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
			    	
			    	
			    	for (var j = 1; j <= property.numKeys; j++) {
			    		
			    		var t = (property.keyTime(j) * 1000) - compAnimStart;
			    		writeString += t.toString() + "MS " + " -> " + property.name + " key" + j + ": " + property.keyValue(j).toString() + lineReturn;
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
								writeString += "Can't calculate bezier on path anim";
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







