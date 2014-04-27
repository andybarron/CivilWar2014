function LoadNPCs(NPCArray){
 
xmlDoc = loadXMLDoc("js/NPCs/NPClist.xml");
 
var name = xmlDoc.getElementsByTagName("name");
//console.log(name[0].childNodes[0].nodeValue);
var x = xmlDoc.getElementsByTagName("xpos");
//console.log(x[0].childNodes[0].nodeValue);
var y = xmlDoc.getElementsByTagName("ypos");
//console.log(y[0].childNodes[0].nodeValue); 
var texture1 = xmlDoc.getElementsByTagName("main_texture");
//console.log(texture1[0].childNodes[0].nodeValue);
var texture2 = xmlDoc.getElementsByTagName("interact_texture");
//console.log(texture2[0].childNodes[0].nodeValue);

for(var i = 0; i < xmlDoc.getElementsByTagName("NPC").length;i++){
	
	var textures = [];
	textures.push(Images.getTexture(texture1[i].childNodes[0].nodeValue));
	textures.push(Images.getTexture(texture2[i].childNodes[0].nodeValue));

	var NPC = {	name:name[i].childNodes[0].nodeValue, 
				x:x[i].childNodes[0].nodeValue, 
				y:y[i].childNodes[0].nodeValue, 
				texture:textures};

	NPCArray.push(NPC);

	}
}

//helper functions

function loadXMLDoc(filename)
{
if (window.XMLHttpRequest)
  {
  xhttp=new XMLHttpRequest();
  }
else // ew, code for IE5 and IE6
  {
  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xhttp.open("GET",filename,false);
xhttp.send();
return xhttp.responseXML;
}

function loadXMLString(txt) 
{
if (window.DOMParser)
  {
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(txt,"text/xml");
  }
else // ew, code for IE
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async=false;
  xmlDoc.loadXML(txt); 
  }
return xmlDoc;
}