/**
 *
 *  Project Artiste
 *
 *  Info: A blurred wallpaper maker based on HTML5 canvas' anti-aliasing properties
 *
 *  Start Date: Wednesday, Sept. 25, 2014 @ ~9:00PM +8GMT
 *
 *  Copyright (c) kearlsaint@gmail.com
 *
 *  File: Artiste.js
 *
 *  Disclaimer Notes:
 *      If you want the source code, please visit
 *    my github at http://github.com/kearlsaint
 *
 *    Thank you!
 *
**/

// global variables
var timeout;
var speed   = 10;
var pixels  = document.createElement("canvas");
var actual  = document.createElement("canvas");
var preview = document.getElementById("Artiste");

// Artiste class
var Artiste = function(cols, rows, width, height){
	
	var self = this;

	// set the actual in-memory canvas size
	actual.width  = width;
	actual.height = height;

	// set the height and width of the miniature canvas
	pixels.width = cols;
	pixels.height = rows;

	// create the list
	self.list = new Array(cols);
	for(var x=0; x<cols; x++){
		self.list[x] = new Array(rows);
	}

	// returns a random shit between 0 and x
	var rand = function(x){
		return Math.round(Math.random()*x);
	};
	
	// makes a 1x1 canvas and returns it with the color specified
	var temp = document.createElement("canvas");
	temp.width = temp.height = 1;
	temp = temp.getContext("2d");
	var make = function(color){
		temp.fillStyle = color;
		temp.fillRect(0, 0, 1, 1);
		return temp.canvas;
	};

	// create some random colored pixels
	for(var i=0; i<rand(cols+rows); i++){
		self.list[rand(cols-1)][rand(rows-1)] = [rand(255),rand(255),rand(255)];
	}
	
	// changes the color of the pixel at x,y
	var change = function(x, y, ox, oy){
		// dont change non-existing
		if(x<0||x>cols-1||y<0||y>rows-1) return;
		var arr = self.list;
		var rgb = arr[x][y];
		if(rgb===undefined){
			// color with the original
			arr[x][y] = [arr[ox][oy][0], arr[ox][oy][1], arr[ox][oy][2]];
			rgb = arr[x][y];
		}else{
			if(ox!==undefined && oy!==undefined){
				var dr, dg, db;
				dr = arr[ox][oy][0] - rgb[0];
				dg = arr[ox][oy][1] - rgb[1];
				db = arr[ox][oy][2] - rgb[2];
				if(dr > dg && dr > db){
					if((rgb[0]+1) > 230){
						rgb[0] = 100;
					}else{
						rgb[0]++;
					}
				}else if(dg > dr && dg > db){
					if((rgb[1]+1) > 230){
						rgb[1] = 100;
					}else{
						rgb[1]++;
					}
				}else{
					if((rgb[2]+1) > 230){
						rgb[2] = 100;
					}else{
						rgb[2]++;
					}
				}
			}
		}
	};
	
	// draws it to the pixel-ed canvas
	var draw = function(x,y){
		var rgb = self.list[x][y];
		var img = make("rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")");
		pixels.getContext("2d").drawImage(img, 0, 0, 1, 1, x, y, 1, 1);
	};
	
	// the main loop
	var loop = function(){
		// redraw
		actual.width = actual.width;
		var arr = self.list;
		// list only the color-ed
		var colored = [];
		for(var x=arr.length-1; x>=0; x--){
			for(var y=arr[x].length-1; y>=0; y--){
				if(arr[x][y]!==undefined){
					colored.push([x,y]);
				}
			}
		}
		// change the color-ed and its neighbors
		for(var i=0; i<colored.length; i++){
			var x = colored[i][0];
			var y = colored[i][1];
			// has color
			change(x,y);
			// color its neighbor too
			change(x-1, y, x, y);
			change(x+1, y, x, y);
			change(x, y-1, x, y);
			change(x, y+1, x, y);
			// draw this
			draw(x, y);
		}
		actual.getContext("2d").drawImage(pixels, 0, 0, cols, rows, 0, 0, width, height);
		preview.getContext("2d").drawImage(pixels, 0, 0, cols, rows, 0, 0, preview.width, preview.height);
		timeout = setTimeout(loop, 1000/speed);
	};

	clearTimeout(timeout);
	loop();

};

var changeSpeed = function(e){
	Speed.innerHTML = e.value;
	speed = parseInt(e.value);
};
var changeColumns = function(e){
	Columns.innerHTML = e.value;
	create();
};
var changeRows = function(e){
	Rows.innerHTML = e.value;
	create();
};
var changeWidth = function(e){
	Width.innerHTML = e.value;
	create();
};
var changeHeight = function(e){
	Height.innerHTML = e.value;
	create();
};

var create = function(){
	speed = parseInt(Speed.innerHTML);
	new Artiste(parseInt(Columns.innerHTML), parseInt(Rows.innerHTML), parseInt(Width.innerHTML), parseInt(Height.innerHTML));
}

var getActual = function(){
	var img = new Image();
	img.src = actual.toDataURL();
	var nt = window.open();
	nt.document.body.innerHTML = img.outerHTML;
}

create();