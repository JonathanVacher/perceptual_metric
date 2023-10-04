var token = "xxxxxxxx";

var url_prolific_sf = "https://app.prolific.co/submissions/complete?cc=";
var url_prolific_sf_bdw = "https://app.prolific.co/submissions/complete?cc=";
var url_prolific_ori_bdw = "https://app.prolific.co/submissions/complete?cc=";
var url_prolific_pairs = 
	[["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="],
	 ["https://app.prolific.co/submissions/complete?cc="]]


var url_consent_usa = "https://";
var url_consent_fr = "https://";

var url_explanation = "explanation.html"

/* Functions */
var data_directory = '../data/'
var id = 0;
var feedback_count = 0;
var show_intro_practice = 1;
var gamma_val = 2.2; //2.2; 
var gamma_val1 = 1.0;
var gamma_val2 = 1.0;
var gamma_val3 = 1.0;
var grey = parseInt(127);
var screen_type_options = ["The screen attached to the laptop I'm using",
			    "An external screen plugged to my laptop/desktop"];

var mask_images = [];
var mask_dir = 'mask';
var n = 20; 
for (var j=0; j<n; j++){
	if (j<10){
		mask_images.push('img/'+mask_dir+'/mask_0'+(j).toString()+'.png');
	} 
	else{
		mask_images.push('img/'+mask_dir+'/mask_'+(j).toString()+'.png');
	}   
}

//
function measure_gamma1(canvasId, gamma){
	let c = document.getElementById(canvasId);
	let ctx = c.getContext("2d");
	let img1 = new Image;
	img1.src = 'img/stripes-patches-1.png';

	let g1 = parseFloat(255*Math.pow((Math.pow(0.196, gamma)+
		                      Math.pow(0.392, gamma)+
		                      Math.pow(0.588, gamma))/4,
		                      1/gamma));    

	ctx.drawImage(img1, 384, 0);    

	ctx.beginPath();
	ctx.arc(384+128,128, 70, 0, 2*Math.PI, true);
	ctx.fillStyle = "rgb("+g1+","+g1+","+g1+")";
	ctx.fill();
}

//
function measure_gamma2(canvasId, gamma){
	let c = document.getElementById(canvasId);
	let ctx = c.getContext("2d");
	let img1 = new Image;
	img1.src = 'img/stripes-patches-2.png';

	let g1 = parseFloat(255*Math.pow((Math.pow(0.251, gamma)+
		                      Math.pow(0.749, gamma)+
		                      1.0)/4,
		                      1/gamma));
		                      
	ctx.drawImage(img1, 384, 0);    

	ctx.beginPath();
	ctx.arc(384+128,128, 70, 0, 2*Math.PI, true);
	ctx.fillStyle = "rgb("+g1+","+g1+","+g1+")";
	ctx.fill();
}

//
function measure_gamma3(canvasId, gamma){
	let c = document.getElementById(canvasId);
	let ctx = c.getContext("2d");
	let img1 = new Image;
	img1.src = 'img/stripes-patches-3.png';

	let g1 = parseFloat(255*Math.pow((Math.pow(0.216, gamma)+
		                      Math.pow(0.412, gamma)+
		                      Math.pow(0.608, gamma)+
		                      Math.pow(0.804, gamma))/4,
		                      1/gamma));    

	ctx.drawImage(img1, 384, 0);    

	ctx.beginPath();
	ctx.arc(384+128,128, 70, 0, 2*Math.PI, true);
	ctx.fillStyle = "rgb("+g1+","+g1+","+g1+")";
	ctx.fill();
}

//
function adjust_gamma(data) {
	const gammaCorrection = 1 / gamma_val;                    
	for (var i = 0; i < data.length; i += 4) {
		data[i] = 255 * Math.pow((data[i] / 255), gammaCorrection);
		data[i+1] = 255 * Math.pow((data[i+1] / 255), gammaCorrection);
		data[i+2] = 255 * Math.pow((data[i+2] / 255), gammaCorrection);
	}
}


function intro_practice_cond(){
	if(show_intro_practice==1){
		show_intro_practice = 0;
		return true;
	} else {
		return false;
	}
}


function feedback_cond(){
	if(feedback_count<3){
	    return true;
	} else {
	    return false;
	}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// helper grid to draw functions
var draw_grid = function(c) {
    var ctx = c.getContext('2d');
    c_w = c.width;
    c_h = c.height;

    for (x = 0; x <= c_w; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, c_h);
        for (y = 0; y <= c_h; y += 20) {
            ctx.moveTo(0, y);
            ctx.lineTo(c_w, y);
        }
    }
    ctx.stroke();

};

// Arrows
function canvas_arrow(context, fromx, fromy, tox, toy, r, color){
    var x_center = tox;
    var y_center = toy;

    var angle;
    var x;
    var y;

	context.fillStyle = color;
    context.beginPath();

    angle = Math.atan2(toy-fromy,tox-fromx)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1/3)*(2*Math.PI)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1/3)*(2*Math.PI)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.lineTo(x, y);

    context.closePath();

    context.fill();
}


// draw a wedge
function draw_wedge(c, ctx, c_x, c_y, arc_c, arc_w, radius, color){
	var arc_w_rad = arc_w* Math.PI / 180;
	var arc_c_rad = -arc_c * Math.PI / 180;
	var posx = 0.5*c.width + c_x;
	var posy = 0.5*c.height + c_y;

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(posx, posy);
	ctx.fillStyle = color;
	ctx.arc(posx, posy, radius, arc_c_rad-arc_w_rad/2,
						    	arc_c_rad+arc_w_rad/2, false);
	ctx.closePath();
	ctx.fill();
	ctx.restore();

}

// draw a wedge
function draw_2wedges(c, ctx, c_x, c_y, arc_c, arc_w, radius, colors){
	draw_wedge(c, ctx, c_x, c_y, arc_c-arc_w/4, arc_w/2,
			   radius, colors[0])
	draw_wedge(c, ctx, c_x, c_y, arc_c+arc_w/4, arc_w/2,
			   radius, colors[1])
}

// draw donuts portion
function draw_donuts(c, ctx, c_x, c_y, arc_c, arc_w,
					 radius, colors, gray_color, correct){
	draw_2wedges(c, ctx, c_x, c_y, arc_c, arc_w, 1.65*radius, colors);
	draw_wedge(c, ctx, c_x, c_y, arc_c, arc_w+20, 1.15*radius, gray_color);
	draw_2wedges(c, ctx, c_x, c_y, 180+arc_c, arc_w, 1.65*radius, colors);
	draw_wedge(c, ctx, c_x, c_y, 180+arc_c, arc_w+20, 1.15*radius, gray_color);
	if(correct==1){
		let all_data = ctx.getImageData(0, 0, c.width, c.height);
		adjust_gamma(all_data.data);
		ctx.putImageData(all_data, 0, 0);
	}

}

function draw_circle(c, ctx, radius, color){
	var c_w = c.width;
	var c_h = c.height;
	var posx = 0.5*c_w;
	var posy = 0.5*c_h;

	ctx.save(); 
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = color;
	ctx.arc(posx, posy, radius, 0, 6.28, false);            
	ctx.stroke();
	ctx.closePath();            
	ctx.restore();
}


function draw_circle_pos(c, ctx, radius, posx, posy, color){
	ctx.save(); 
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = color;
	ctx.arc(posx, posy, radius, 0, 6.28, false);            
	ctx.stroke();
	ctx.closePath();            
	ctx.restore();
}


function disp_single(c, ctx, img, radius, color){
	var c_w = c.width;
	var c_h = c.height;
	var half_w = img.width/2;
	var half_h = img.height/2;

	var posx = 0.5*c_w;
	var posy = 0.5*c_h;

	var grad = ctx.createRadialGradient(posx,posy,0,
		                          		posx,posy,radius);
	grad.addColorStop(0.75, 'rgba(127,127,127,0.0)');
	grad.addColorStop(1, 'rgba(127,127,127,1.0)');

	//
	ctx.save(); 
	ctx.beginPath();
	ctx.arc(posx, posy, 0.99*radius, 0, 6.28, false);            
	ctx.closePath();            
	ctx.clip(); 
	ctx.drawImage(img, -half_w+posx, -half_h+posy);
	ctx.restore();
	
	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx, posy, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad;
	ctx.fillRect(0,0,c_w,c_h);  
	ctx.restore();

	//draw_fix_dot(c, ctx, posx, posy, 20, color);

	let all_data = ctx.getImageData(0, 0, c_w, c_h);
	adjust_gamma(all_data.data);
	ctx.putImageData(all_data, 0, 0);
}


function disp_single_rot(c, ctx, img, rot_deg, radius, color){
	let c_w = c.width;
	let c_h = c.height;
	let half_w = img.width/2;
	let half_h = img.height/2;

	let posx = 0.5*c_w;
	let posy = 0.5*c_h;

	let grad = ctx.createRadialGradient(posx,posy,0,
		                          		posx,posy,radius);
	grad.addColorStop(0.75, 'rgba(127,127,127,0.0)');
	grad.addColorStop(1, 'rgba(127,127,127,1.0)');

	//
	ctx.save(); 
	ctx.beginPath();
	ctx.arc(posx, posy, 0.99*radius, 0, 6.28, false);            
	ctx.closePath();            
	ctx.clip(); 
	// rotation
	ctx.translate(c_w/2,c_h/2);
    ctx.rotate(-rot_deg*Math.PI/180);
	ctx.translate(-c_w/2,-c_h/2);
	// disp image
	ctx.drawImage(img, -half_w+posx, -half_h+posy);
	ctx.restore();
	
	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx, posy, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad;
	ctx.fillRect(0,0,c_w,c_h);  
	ctx.restore();

	//draw_fix_dot(c, ctx, posx, posy, 20, color);

	let all_data = ctx.getImageData(0, 0, c_w, c_h);
	adjust_gamma(all_data.data);
	ctx.putImageData(all_data, 0, 0);
}


function draw_fix_dot(c, ctx, posx, posy, radius, color){
	
	let fix = ctx.createRadialGradient(posx,posy, 0,
									   posx,posy, radius);
	//fix.addColorStop(0.0, 'rgba('+grey+','+grey+','+grey+',1.0)');
	fix.addColorStop(0.5, 'rgba('+grey+','+grey+','+grey+',1.0)');
	fix.addColorStop(1.0, 'rgba('+grey+','+grey+','+grey+',0.0)');
	
	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx, posy, radius, 0, 6.28);
	ctx.closePath();
	//ctx.clip();
	ctx.fillStyle = fix;
	//'rgb('+grey+','+grey+','+grey+')';
	ctx.fillRect(0,0,c.width,c.height);  
	ctx.restore();

	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx, posy, 3, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
	
}


function disp_example(c, ctx, img, rot_deg, radius, posx, posy, color){
	var c_w = c.width;
	var c_h = c.height;
	var half_w = img.width/2;
	var half_h = img.height/2;

	var grad = ctx.createRadialGradient(posx,posy,0,
		                          		posx,posy,radius-0);
	grad.addColorStop(0.75, 'rgba(127,127,127,0.0)');
	grad.addColorStop(1, 'rgba(127,127,127,1.0)');

	//
	deg = rot_deg.toString();
		
	ctx.save(); 
	ctx.beginPath();
	ctx.arc(posx, posy, 0.99*radius, 0, 6.28, false);            
	ctx.closePath();            
	ctx.clip(); 	
	ctx.translate(posx, posy);
	ctx.rotate(-rot_deg*Math.PI/180);
	ctx.drawImage(img, -half_w, -half_h);
	ctx.restore();
	
	
	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx, posy, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad;
	ctx.fillRect(0,0,c_w,c_h);  
	ctx.restore();

	draw_circle_pos(c, ctx, 1.25*radius, posx, posy, color)
	
}

// single image 2AFC
function disp_example_single(c, ctx, img, rot_deg, radius, posx, posy){
	var c_w = c.width;
	var c_h = c.height;
	var half_w = img.width/2;
	var half_h = img.height/2;

	var grad = ctx.createRadialGradient(posx,posy,0,
		                          		posx,posy,radius-0);
	grad.addColorStop(0.75, 'rgba(127,127,127,0.0)');
	grad.addColorStop(1, 'rgba(127,127,127,1.0)');

	//
	deg = rot_deg.toString();
		
	ctx.save(); 
	ctx.beginPath();
	ctx.arc(posx, posy, 0.99*radius, 0, 6.28, false);            
	ctx.closePath();            
	ctx.clip(); 	
	ctx.translate(posx, posy);
	ctx.rotate(-rot_deg*Math.PI/180);
	ctx.drawImage(img, -half_w, -half_h);
	ctx.restore();
	
	
	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx, posy, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad;
	ctx.fillRect(0,0,c_w,c_h);  
	ctx.restore();
	
}

//
function _save_data(name, data){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'extra-js/write_data.php'); 
	// 'write_data.php' is the path to the php file described above.
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({filename: name, filedata: data}));
}

//
function save_data_calibration(exp){
	var name = data_directory+'screen_calibration_'+id+'_'+exp_id+'.csv';
	var data = jsPsych.data.get().filter(
			[{save_type: 'response_calibration'},
			 {save_type: 'response_consent'}]).csv();	
	_save_data(name, data);
}

//
function save_data_test(){
	var name = data_directory+'test.txt';
	console.log(name);
	var data = 'test';	
	_save_data(name, data);
}


