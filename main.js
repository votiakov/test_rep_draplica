// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {

	
	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');
	
	var sketch = document.querySelector('#sketch');
	var sketch_style = getComputedStyle(sketch);
	canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	canvas.height = parseInt(sketch_style.getPropertyValue('height'));
	
	var canvas_small = document.getElementById('brush_size');
    var context_small = canvas_small.getContext('2d');
    var centerX = canvas_small.width / 2;
    var centerY = canvas_small.height / 2;
    var radius ;
	var star_count = 5;
	
	var temp_color = 'blue';
	
	var eventMy = new Event('collision');
	
	
	// Creating a tmp canvas
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;
	
	sketch.appendChild(tmp_canvas);

	var mouse = {x: 0, y: 0};
	var start_mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	var sprayIntervalID;
	
	// Pencil Points
	var ppts = [];
	
	//undo array
	var undo_arr = [];
	
	var undo_count = 0;
	
	var empty_canv;
	
	
	
	
	
	// current tool
	var tool = 'brush';
	 
	 $('#tools button').on('click', function(){
            tool = $(this).attr('id');
            console.log(tool);
        })
		
		
	
	
	/* Mouse Capturing Work */
	
	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	
	
	/* Drawing on Paint App */
	tmp_ctx.lineWidth = document.getElementById("width_range").value;
	//tmp_ctx.lineWidth = 5;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = 'blue';
	tmp_ctx.fillStyle = 'blue';
	//tmp_ctx.globalAlpha = 0.5;
	
	var drawBrush = function() {
	
	context_small.clearRect(0, 0, canvas_small.width, canvas_small.height);
		
		radius = tmp_ctx.lineWidth;
		radius = radius / 2;
		
		context_small.beginPath();
		context_small.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context_small.fillStyle = temp_color;
		context_small.globalAlpha = tmp_ctx.globalAlpha;
		context_small.fill();
		
		};
		
	//show current brush view
	drawBrush();
	
	empty_canv = canvas.toDataURL();
	undo_arr.push(empty_canv);
	
	tmp_canvas.addEventListener('mousedown', function(e) {
	console.log("Mouse DIWN");
		tmp_canvas.addEventListener('mousemove', onPaint, false);
		
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		start_mouse.x = mouse.x;
		start_mouse.y = mouse.y;
		
		//console.log(mouse.x,canvas.clientWidth,mouse.y,canvas.clientHeight);
		
		ppts.push({x: mouse.x, y: mouse.y}); 

		//spraying tool.
		sprayIntervalID = setInterval(onPaint, 50);
		
		onPaint();
		//onPaintCircle();
	
	}, false);
	
	tmp_canvas.addEventListener('mouseup', function() {
	
	console.log("Mouse UP");
	
	
		tmp_canvas.removeEventListener('mousemove', onPaint, false);
		
		
		
		// for erasing
		ctx.globalCompositeOperation = 'source-over';
		//spraying tool.
		clearInterval(sprayIntervalID);
		
		// Writing down to real canvas now
		ctx.drawImage(tmp_canvas, 0, 0); 
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		// Emptying up Pencil Points
		ppts = [];
		
		
		
		undo_arr.push(canvas.toDataURL());	
		//window.alert(undo_arr.length);
		undo_count = 0;
		
		
	}, false);
	
	tmp_canvas.addEventListener('collision', function() {
	
	console.log("Mouse UP");
	
		/*if ( mouse.x >= canvas.clientWidth-10 ) { mouse.x = canvas.clientWidth-5; }
		if ( mouse.y >= canvas.clientHeight-10 ) { mouse.y = canvas.clientHeight-5; }
	
		if ( mouse.x <= 10 ) { mouse.x = 5; }
		if ( mouse.y <= 10 ) { mouse.y = 5; }*/
	
		tmp_canvas.removeEventListener('mousemove', onPaint, false);
		
		
		
		// for erasing
		ctx.globalCompositeOperation = 'source-over';
		//spraying tool.
		clearInterval(sprayIntervalID);
		
		
		// Writing down to real canvas now
		ctx.drawImage(tmp_canvas, 0, 0); 
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		// Emptying up Pencil Points
		ppts = [];
		
		
		
		undo_arr.push(canvas.toDataURL());	
		//window.alert(undo_arr.length);
		undo_count = 0;
		
		
	}, false);
	
	
	
	
	
	var callUndo = function(){
	
	/*window.alert(undo_count);
	window.alert(undo_arr.length);*/
	

	if ( undo_arr.length > 1 ) {
		
								
						
				if ( undo_count + 1 < undo_arr.length ) {
					if ( undo_count + 2 == undo_arr.length ) { 
						if (confirm("Do you really want to UNDO ??? WARNING ! You will not be able to REDO this step ")) {
							undo_count++;
							UndoFunc(undo_count); 
						}
					}
					else {
					undo_count++;
					//window.alert(undo_count);
					UndoFunc(undo_count);
						}
	
					if ( undo_count + 1 == undo_arr.length ) { undo_count = 0; undo_arr = []; undo_arr.push(empty_canv); }

				
			
		}
	
	//else { undo_count = 0; undo_arr = []; undo_arr.push(empty_canv); }
	}
	
	
};

	
	

	document.getElementById("undo").addEventListener("click", callUndo);
	
	

	
	
	
	var callRedo = function(){
		
		if ( undo_count > 0 ) {
		undo_count--;
		UndoFunc(undo_count);
		}
		
	
	};
	
	document.getElementById("redo").addEventListener("click", callRedo);
	
	
	
	var temp_color;
	
	document.getElementById("strokecolor").addEventListener("change", function(){
		tmp_ctx.strokeStyle = document.getElementById('color_value_form').value;
		tmp_ctx.fillStyle = tmp_ctx.strokeStyle;
		temp_color = tmp_ctx.fillStyle;
		drawBrush();
		
	
	
	});
	
	
	
	var callDownload = function() {
		download(paint,'myPicture.png');
		};
	
	document.getElementById("id_download").addEventListener("click", callDownload);
	
	function download(canvas, filename) {

	
	//create a dummy CANVAS

	
    // create an "off-screen" anchor tag
    var lnk = document.createElement('a'),
        e;

    // the key here is to set the download attribute of the a tag
    lnk.download = filename;

    // convert canvas content to data-uri for link. When download
    // attribute is set the content pointed to by link will be
    // pushed as "download" in HTML5 capable browsers
    lnk.href = canvas.toDataURL();

    // create a "fake" click-event to trigger the download
    if (document.createEvent) {

        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);

        lnk.dispatchEvent(e);

    } else if (lnk.fireEvent) {

        lnk.fireEvent("onclick");
    }
};
	
	
	
	  
	document.getElementById("width_range").addEventListener("change", function(){
		tmp_ctx.lineWidth = document.getElementById("width_range").value / 2;
		
		drawBrush();
		//document.getElementById("brush_size")
		
	});
	
	document.getElementById("opacity_range").addEventListener("change", function(){
		tmp_ctx.globalAlpha = document.getElementById("opacity_range").value / 100;
		
		drawBrush();
		//document.getElementById("brush_size")
		
	});
	
	document.getElementById("starCount").addEventListener("change", function() {
	
		var x = document.getElementById("starCount").selectedIndex;
		star_count = document.getElementsByTagName("option")[x].value;
		
		
		});
	
	var callClear = function(){
		
		if (confirm("Do you really want CLEAR the canvas?")) {
			undo_arr.push(canvas.toDataURL());	
			ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
			}
		
	
	};
	
	document.getElementById("clear").addEventListener("click", callClear);
	
	
	
	
	function getChar(event) {
	if (event.which == null) { 
    if (event.keyCode < 32) return null; 
    return String.fromCharCode(event.keyCode) 
	} 

	if (event.which!=0 && event.charCode!=0) { 
    if (event.which < 32) return null; 
    return String.fromCharCode(event.which); 
  } 

  return null; 
}

	
	$(document).keypress(function(event) {
		var charac = getChar(event);
		switch (charac) {
		case '1':
			tool = 'brush';
			break
		case '2':
			tool = 'circle';
			break
			
		case '3':
			tool = 'line';
			break
			
		case '4':
			tool = 'rectangle';
			break
		case '5':
			tool = 'ellipse';
			break	
			
		case '6':
			tool = 'set_ellipse';
			break
		
		case '7':
			tool = 'spray';
			break
			
		case '8':
			tool = 'star';
			star_count = prompt("How much points do you want in star?",5);
			
			break
			
		case '9':
			tool = 'eraser';
			break
			
		case '+':
			tmp_ctx.lineWidth = tmp_ctx.lineWidth + 1;
			drawBrush();
			break
			
		case '-':
			tmp_ctx.lineWidth = tmp_ctx.lineWidth - 1;
			drawBrush();
			break
			
			
		case ']':
			tmp_ctx.globalAlpha = tmp_ctx.globalAlpha + 0.1;
			drawBrush();
			break
			
		case '[':
			tmp_ctx.globalAlpha = tmp_ctx.globalAlpha - 0.1;
			drawBrush();
			break
			
		case 'u':
			callUndo();
			break
				
		case 'r':
			callRedo();
			break
			
		case 'c':
			callClear();
			break
			
		case 's':
			callDownload();
			break
			
		
		default:
			
			break
}

      //alert(charac );
});
	
	
	$('input[name=is_bg_image]').change(function(){

    if($(this).is(':checked'))
    {
        canvas.style.backgroundImage = 'url(notebook_texture.jpg)';
    }
    else
    {
        canvas.style.backgroundImage = 'none';
    }    

});
	
	
	
	
	var onPaintCircle = function() {
	//console.log(mouse.x,canvas.clientWidth,mouse.y,canvas.clientHeight);
	
	
 
    // Tmp canvas is always cleared up before drawing.
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
 
    var x = (mouse.x + start_mouse.x) / 2;
    var y = (mouse.y + start_mouse.y) / 2;
 
    var radius = Math.max(
        Math.abs(mouse.x - start_mouse.x),
        Math.abs(mouse.y - start_mouse.y)
    ) / 2;
 
    tmp_ctx.beginPath();
    tmp_ctx.arc(x, y, radius, 0, Math.PI*2, false);
    // tmp_ctx.arc(x, y, 5, 0, Math.PI*2, false);
    tmp_ctx.stroke();
    tmp_ctx.closePath();
	
 
};
	
	var onPaintBrush = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		if (ppts.length < 3) {
			var b = ppts[0];
			tmp_ctx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			tmp_ctx.fill();
			tmp_ctx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		tmp_ctx.beginPath();
		tmp_ctx.moveTo(ppts[0].x, ppts[0].y);
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		tmp_ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		tmp_ctx.stroke();
		
	};
	
	var onPaintLine = function() {
 
    // Tmp canvas is always cleared up before drawing.
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
 
    tmp_ctx.beginPath();
    tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
    tmp_ctx.lineTo(mouse.x, mouse.y);
    tmp_ctx.stroke();
    tmp_ctx.closePath();
	
	
 
};

var onPaintRect = function() {
 
    // Tmp canvas is always cleared up before drawing.
   // tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
 
    var x = Math.min(mouse.x, start_mouse.x);
	var y = Math.min(mouse.y, start_mouse.y);
	var width = Math.abs(mouse.x - start_mouse.x);
	var height = Math.abs(mouse.y - start_mouse.y);
	tmp_ctx.strokeRect(x, y, width, height);
	
	
 
};



function drawEllipse(ctx, x, y, w, h) {

	
	
		var kappa = .5522848,
			ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle
		
		ctx.beginPath();
		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		ctx.closePath();
		ctx.stroke();
	};
	
function drawStar(p, m)
{

	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
	
	var x = (mouse.x + start_mouse.x) / 2;
    var y = (mouse.y + start_mouse.y) / 2;
	
	var r = Math.max(
        Math.abs(mouse.x - start_mouse.x),
        Math.abs(mouse.y - start_mouse.y)
    ) / 2;
	
    tmp_ctx.save();
    tmp_ctx.beginPath();
    tmp_ctx.translate(x, y);
    tmp_ctx.moveTo(0,0-r);
    for (var i = 0; i < p; i++)
    {
        tmp_ctx.rotate(Math.PI / p);
        tmp_ctx.lineTo(0, 0 - (r*m));
        tmp_ctx.rotate(Math.PI / p);
        tmp_ctx.lineTo(0, 0 - r);
    }
    tmp_ctx.fill();
    tmp_ctx.restore();
};

	
	
		var onErase = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		ctx.lineWidth = tmp_ctx.lineWidth;
		
		if (ppts.length < 3) {
			var b = ppts[0];
			ctx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			ctx.fill();
			ctx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.beginPath();
		ctx.moveTo(ppts[0].x, ppts[0].y);
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		ctx.stroke();
		
	};
	
	var getRandomOffset = function(radius) {
	
    var random_angle = Math.random() * (2*Math.PI);
    var random_radius = Math.random() * radius;
     
    // console.log(random_angle, random_radius, Math.cos(random_angle), Math.sin(random_angle));
     
    return {
        x: Math.cos(random_angle) * random_radius,
        y: Math.sin(random_angle) * random_radius
    };
};

	var generateSprayParticles = function() {
    // Particle count, or, density
    var density = tmp_ctx.lineWidth*2;
     
    for (var i = 0; i < density; i++) {
        var offset = getRandomOffset(tmp_ctx.lineWidth);
         
        var x = mouse.x + offset.x;
        var y = mouse.y + offset.y;
         
        tmp_ctx.fillRect(x, y, 1, 1);
    }
};

	var UndoFunc = function(count) {
	
	
	var number = undo_arr.length;
	var img_data = undo_arr[number - (count + 1)];
	var undo_img = new Image();
	
	undo_img.src = img_data.toString();
	
	ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
	ctx.drawImage(undo_img, 0, 0);
	
	
	
	//window.alert('undoing'); 
	
	

};



	
	var onPaint = function() {
	
	//console.log(mouse.x,canvas.clientWidth,mouse.y,canvas.clientHeight);
	//if ( mouse.x < canvas.clientWidth-10 &&  mouse.y < canvas.clientHeight-10) 
	if ( mouse.x <=6 || mouse.x >= canvas.clientWidth-6 || mouse.y <=6 || mouse.y >= canvas.clientHeight-6 ) {
	if ( mouse.x <= 6 ) {	mouse.x = 5; }
	if ( mouse.x >= canvas.clientWidth-6 ) { mouse.x = canvas.clientWidth-5; }
	if ( mouse.y <= 6) {	mouse.y = 5; }
	if ( mouse.y >= canvas.clientHeight-6 ) { mouse.x = canvas.clientHeight-5; }
	
		ppts.push({x: mouse.x, y: mouse.y}); 
		//onPaint();
		
		tmp_canvas.dispatchEvent(eventMy);
		return;
		//tmp_canvas.click();
		}
	
	
	
		if ( tool == 'brush' )
		{	onPaintBrush(); }
		else if ( tool == 'circle' )
		{	onPaintCircle(); }
		else if ( tool == 'line' )
		{	onPaintLine(); }
		else if ( tool == 'rectangle' )
		{	
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		onPaintRect(); }
		
		else if ( tool == 'ellipse' )
		{
		
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		var x = Math.min(mouse.x, start_mouse.x);
		var y = Math.min(mouse.y, start_mouse.y);
		
		var w = Math.abs(mouse.x - start_mouse.x);
		var h = Math.abs(mouse.y - start_mouse.y);
		
		drawEllipse(tmp_ctx, x, y, w, h);
		}
		
		else if ( tool == 'set_ellipse' )
		{
		
		
		var x = Math.min(mouse.x, start_mouse.x);
		var y = Math.min(mouse.y, start_mouse.y);
		
		var w = Math.abs(mouse.x - start_mouse.x);
		var h = Math.abs(mouse.y - start_mouse.y);
		
		var prev_width = tmp_ctx.lineWidth;
		
		tmp_ctx.lineWidth = 0.5;
		
		drawEllipse(tmp_ctx, x, y, w, h);
		
		tmp_ctx.lineWidth = prev_width;
		}
		
		else if ( tool == 'magic_rectangle' )
		{	
		
		tmp_ctx.lineWidth = 0.5;
		onPaintRect();		
			
			}
		
		else if ( tool == 'eraser' )
		{	onErase(); }
		
		else if ( tool == 'spray' )
		{	generateSprayParticles(); }
		
		else if ( tool == 'star' )
		{ drawStar(star_count,0.5); }
		
		
		
		
		
		
		//window.alert(undo_arr);
		
		
	
	};
	

}, false); }