/* Params and functions that are specific to the MLDS experiment */

var comments_mlds = 0;
var n_pause_mlds = 81; // 81 in true experiment

var n_rep_mlds = 5; // =? for real experiment
var n_stim_mlds = 13; 

var exp_id = 'exp_id'
var stimuli_sf = [];
var im_dir = 'stimuli_sf';
for (var j=0; j<n_stim_mlds; j++){
	if (j<10){
		stimuli_sf.push('img/'+im_dir+'/stimuli_sf_0'+(j).toString()+'.png');
	} 
	else{
		stimuli_sf.push('img/'+im_dir+'/stimuli_sf_'+(j).toString()+'.png');
	}   
}

var stimuli_sf_bdw = [];
var im_dir = 'stimuli_sf_bdw';
for (var j=0; j<n_stim_mlds; j++){
	if (j<10){
		stimuli_sf_bdw.push('img/'+im_dir+'/stimuli_sf_bdw_0'+(j).toString()+'.png');
	} 
	else{
		stimuli_sf_bdw.push('img/'+im_dir+'/stimuli_sf_bdw_'+(j).toString()+'.png');
	}   
}

var stimuli_ori_bdw = [];
var im_dir = 'stimuli_ori_bdw';
for (var j=0; j<n_stim_mlds; j++){
	if (j<10){
		stimuli_ori_bdw.push('img/'+im_dir+'/stimuli_ori_bdw_0'+(j).toString()+'.png');
	} 
	else{
		stimuli_ori_bdw.push('img/'+im_dir+'/stimuli_ori_bdw_'+(j).toString()+'.png');
	}   
}

var stimuli_pairs = [[],[],[],[],[],[],[],[],[],[],[],[],];
var im_dir = 'pair_';
for (var k=0; k<12; k++){
	if (k<9){
		str_pre = '0'
	}
	else{
		str_pre = ''
	}

	for (var j=0; j<n_stim_mlds; j++){
		if (j<10){
			stimuli_pairs[k].push('img/'+im_dir+str_pre+(k+1).toString()
									+'/syn/'+im_dir+str_pre+(k+1).toString()
									+'_0'+(j).toString()+'.png');
		} 
		else{
			stimuli_pairs[k].push('img/'+im_dir+str_pre+(k+1).toString()
									+'/syn/'+im_dir+str_pre+(k+1).toString()
									+'_'+(j).toString()+'.png');
		}   
	}
}


///*
var comb = [[ 0,  1,  2],[ 0,  1,  3],[ 0,  1,  4],[ 0,  2,  3],[ 0,  2,  4],
			[ 0,  2,  5],[ 0,  3,  4],[ 0,  3,  5],[ 0,  3,  6],[ 1,  2,  3],
			[ 1,  2,  4],[ 1,  2,  5],[ 1,  3,  4],[ 1,  3,  5],[ 1,  3,  6],
			[ 1,  4,  5],[ 1,  4,  6],[ 1,  4,  7],[ 2,  3,  4],[ 2,  3,  5],
			[ 2,  3,  6],[ 2,  4,  5],[ 2,  4,  6],[ 2,  4,  7],[ 2,  5,  6],
			[ 2,  5,  7],[ 2,  5,  8],[ 3,  4,  5],[ 3,  4,  6],[ 3,  4,  7],
			[ 3,  5,  6],[ 3,  5,  7],[ 3,  5,  8],[ 3,  6,  7],[ 3,  6,  8],
			[ 3,  6,  9],[ 4,  5,  6],[ 4,  5,  7],[ 4,  5,  8],[ 4,  6,  7],
			[ 4,  6,  8],[ 4,  6,  9],[ 4,  7,  8],[ 4,  7,  9],[ 4,  7, 10],
			[ 5,  6,  7],[ 5,  6,  8],[ 5,  6,  9],[ 5,  7,  8],[ 5,  7,  9],
			[ 5,  7, 10],[ 5,  8,  9],[ 5,  8, 10],[ 5,  8, 11],[ 6,  7,  8],
			[ 6,  7,  9],[ 6,  7, 10],[ 6,  8,  9],[ 6,  8, 10],[ 6,  8, 11],
			[ 6,  9, 10],[ 6,  9, 11],[ 6,  9, 12],[ 7,  8,  9],[ 7,  8, 10],
			[ 7,  8, 11],[ 7,  9, 10],[ 7,  9, 11],[ 7,  9, 12],[ 7, 10, 11],
			[ 7, 10, 12],[ 8,  9, 10],[ 8,  9, 11],[ 8,  9, 12],[ 8, 10, 11],
			[ 8, 10, 12],[ 8, 11, 12],[ 9, 10, 11],[ 9, 10, 12],[ 9, 11, 12],
			[10, 11, 12]]
/*
var comb = [[ 0,  1,  7],[ 3,  8,  9],
			[ 5,  6,  12],[ 2,  5,  8],
			[ 6,  9,  12],[ 9, 11, 12],
			[ 2,  4,  7],[ 6,  7,  9],
			[ 7,  9, 10],[ 1,  4,  5]];
*/


var comb_train = [[ 0,  1,  7],[ 3,  8,  9],
				  [ 5,  6,  12],[ 2,  5,  8],
				  [ 6,  9,  12],[ 9, 11, 12],
				  [ 2,  4,  7],[ 6,  7,  9],
				  [ 7,  9, 10],[ 1,  4,  5]];


var n_comb = comb.length; 
var triplets = [];
for (var i=0; i<n_comb; i++){
    triplets.push({id_and_triplet: {trialId: i, triplet: comb[i]}});
}

var n_comb_train = comb_train.length; 
var triplets_train = [];
for (var i=0; i<n_comb_train; i++){
    triplets_train.push({id_and_triplet:
		 {trialId: i, triplet: comb_train[i]}});
}

var resp_text_mlds = '<div style="width: 300px; margin:auto">'
+'<div style="width: 100px; height: 30px; float: left">'
+'<b style="color:rgb(200,40,0)">First</b>'
+'</div>'
+'<div style="margin-left: 200px; height: 30px">'
+'<b style="color:rgb(0,114,189)">Second</b><br/>'
+'</div>'
+'</div>'

var instruction_text_mlds_1 = '<div style="width: 600px; margin-bottom: 70px">'
+'To answer, wait for the end '
+'of the stimulus screen and press the left '
+'arrow of your keyboard if you think the '
+'first pair is more similar than the second '
+'or press the right arrow if you think it is the opposite.'
+'</div>'

var instruction_text_mlds_2 = '<div style="width: 600px; margin-bottom: 30px;'
+'margin-top: 30px">'
+'You will practice the experiment in the next 10 trials. '
+'A Feedback is given for the 3 first trials. '
+'If you answer wrongly to at least one of '
+'these trials, the practice will restart.'
+'</div>'

function pause_stim_mlds(){
	let count = jsPsych.data.get()
			.filter({save_type: 'response_mlds'}).count();
	let count_run = Math.floor(count/n_pause_mlds);
	return 'Run '+count_run.toString()
			+'/5. Take a short break '
			+'(< 30 sec) if needed '
	        +'and press Enter to continue!'
}

function pause_cond_mlds(){
	let count = jsPsych.data.get()
	       .filter({save_type: 'response_mlds'}).count();
	if(count%n_pause_mlds == 0){
	    return true;
	} else {
	    return false;
	}
}

function feedback_stim_mlds(){
	let resp = jsPsych.data.get()
			.last(1).select('response');
	if (feedback_count==0 || feedback_count==2){
		if (resp.values[0]=='arrowright'){
			return "Wrong."
		} else 
		{
			return "Correct!"
		}
	} else
	{
		if (resp.values[0]=='arrowleft'){
			return "Wrong."
		} else 
		{
			return "Correct!"
		}
	}
}

function practice_loop_mlds(data){
	let last_10_trials = jsPsych.data.get()
			.filter({save_type: 'response_mlds_train'})
			.last(10)
			.select('response');
	let q1 = last_10_trials.values[0];
	let q2 = last_10_trials.values[1];
	let q3 = last_10_trials.values[2];
	let q = (q1=='arrowleft')*(q2=='arrowright')*(q3=='arrowleft');
	
	if (q==true){
		return false;
	}
	else{
		show_intro_practice = 1;
		feedback_count = 0;
		return true;
	}
}


function save_trial_data_mlds(data){
	delete data.stimulus
	delete data.trial_type
	delete data.trial_index
	var rdm_lr_idx_ = jsPsych.data.get()
					.last(2).select('idx')
	data.triplet_idx =
		jsPsych.timelineVariable('id_and_triplet',
			                 true).trialId  
	data.rdm_lr_idx = rdm_lr_idx_.values[0];

	data.participant_id = id;
	data.texture_id = im_dir;
	/* 
	Which of the left or right pair is more similar ?
	S1/S2 vs S2/S3
	resp = 1 if S2-S3 < S2-S1 (the right pair is more similar)
	resp = 0 otherwise
	*/
	if(data.response == 'arrowleft'){
	    if(data.rdm_lr_idx[0] == 0){
			data.mlds_resp = false;
	    } 
	    else {
			data.mlds_resp = true;
	    }
	}
	else if(data.response == 'arrowright') {
	    if(data.rdm_lr_idx[0] == 0){
			data.mlds_resp = true;
	    } 
	    else {
			data.mlds_resp = false;
	    }
	}
	var count = jsPsych.data.get()
	       .filter({save_type: 'response_mlds'}).count();
	if(count%n_pause_mlds == 0){
	    data.pause = true;
	} else {
	    data.pause = false;
	}                      
}

function disp_train(canvas, im_center, im_left, im_right, radius, rdm_seed){
	var c = document.getElementById(canvas);
	var ctx = c.getContext("2d");
	var img_c = document.getElementById(im_center);
	var img_l = document.getElementById(im_left);
	var img_r = document.getElementById(im_right);
	var c_w = c.width;
	var c_h = c.height;
	var half_w = img_c.width/2;
	var half_h = img_c.height/2;
	var pos = [[0.5,0.5],[0.5,0.5],[0.5,0.5],[0.5,0.5]];

	var posx_c = 0.5*c_w;
	var posy_c = (0.5-0.3)*c_h;

	var posx_l = (0.5-0.3*Math.sqrt(3)/2)*c_w;
	var posy_l = (0.5+0.3*0.5)*c_h; 

	var posx_r = (0.5+0.3*Math.sqrt(3)/2)*c_w;
	var posy_r = (0.5+0.3*0.5)*c_h;

	var grad_c = ctx.createRadialGradient(posx_c,posy_c,radius-10,
		                          posx_c,posy_c,radius-0);
	grad_c.addColorStop(0, 'rgba(127,127,127,0.0)');
	grad_c.addColorStop(1, 'rgba(127,127,127,1.0)');

	var grad_l = ctx.createRadialGradient(posx_l,posy_l,radius-10,
		                          posx_l,posy_l,radius-0);
	grad_l.addColorStop(0, 'rgba(127,127,127,0.0)');
	grad_l.addColorStop(1, 'rgba(127,127,127,1.0)');

	var grad_r = ctx.createRadialGradient(posx_r,posy_r,radius-10,
		                          posx_r,posy_r,radius-0);
	grad_r.addColorStop(0, 'rgba(127,127,127,0.0)');
	grad_r.addColorStop(1, 'rgba(127,127,127,1.0)');

	//
	ctx.save(); 
	ctx.beginPath();
	ctx.arc(posx_c, posy_c, 0.99*radius, 0, 6.28, false);            
	ctx.closePath();            
	ctx.clip(); 
	ctx.drawImage(img_c, -128*pos[rdm_seed[0]][0]-half_w+posx_c,
		         -128*pos[rdm_seed[0]][1]-half_h+posy_c);
	ctx.restore();

	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx_c, posy_c, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad_c;
	ctx.fillRect(0,0,c_w,c_h);  
	ctx.restore();

	//
	ctx.save();             
	ctx.beginPath();
	ctx.arc(posx_l, posy_l, 0.99*radius, 0, 6.28, false);            
	ctx.closePath();
	ctx.clip(); 
	ctx.drawImage(img_l, -128*pos[rdm_seed[1]][0]-half_w+posx_l,
		         -128*pos[rdm_seed[1]][1]-half_h+posy_l);
	ctx.restore();

	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx_l, posy_l, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad_l;
	ctx.fillRect(0,0,c_w,c_h);
	ctx.restore();

	//
	ctx.save(); 
	ctx.beginPath();
	ctx.arc(posx_r, posy_r, 0.99*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip(); 
	ctx.drawImage(img_r, -128*pos[rdm_seed[2]][0]-half_w+posx_r,
		         -128*pos[rdm_seed[2]][1]-half_h+posy_r);
	ctx.restore();

	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx_r, posy_r, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad_r;
	ctx.fillRect(0,0,c_w,c_h);
	ctx.restore();


	let all_data = ctx.getImageData(0, 0, c_w, c_h);
	adjust_gamma(all_data.data);
	ctx.putImageData(all_data, 0, 0);    
}


function disp(canvas, im_center, im_left, im_right, radius, rdm_seed){
	var c = document.getElementById(canvas);
	var ctx = c.getContext("2d");
	var img_c = document.getElementById(im_center);
	var img_l = document.getElementById(im_left);
	var img_r = document.getElementById(im_right);
	var c_w = c.width;
	var c_h = c.height;
	var half_w = img_c.width/2;
	var half_h = img_c.height/2;
	var pos = [[0,0],[0,1],[1,0],[1,1]];

	var posx_c = 0.5*c_w;
	var posy_c = (0.5-0.3)*c_h;

	var posx_l = (0.5-0.3*Math.sqrt(3)/2)*c_w;
	var posy_l = (0.5+0.3*0.5)*c_h; 

	var posx_r = (0.5+0.3*Math.sqrt(3)/2)*c_w;
	var posy_r = (0.5+0.3*0.5)*c_h;

	var grad_c = ctx.createRadialGradient(posx_c,posy_c,radius-10,
		                          posx_c,posy_c,radius-0);
	grad_c.addColorStop(0, 'rgba(127,127,127,0.0)');
	grad_c.addColorStop(1, 'rgba(127,127,127,1.0)');

	var grad_l = ctx.createRadialGradient(posx_l,posy_l,radius-10,
		                          posx_l,posy_l,radius-0);
	grad_l.addColorStop(0, 'rgba(127,127,127,0.0)');
	grad_l.addColorStop(1, 'rgba(127,127,127,1.0)');

	var grad_r = ctx.createRadialGradient(posx_r,posy_r,radius-10,
		                          posx_r,posy_r,radius-0);
	grad_r.addColorStop(0, 'rgba(127,127,127,0.0)');
	grad_r.addColorStop(1, 'rgba(127,127,127,1.0)');

	//
	ctx.save(); 
	ctx.beginPath();
	ctx.arc(posx_c, posy_c, 0.99*radius, 0, 6.28, false);            
	ctx.closePath();            
	ctx.clip(); 
	ctx.drawImage(img_c, -128*pos[rdm_seed[0]][0]-half_w+posx_c,
		         -128*pos[rdm_seed[0]][1]-half_h+posy_c);
	ctx.restore();

	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx_c, posy_c, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad_c;
	ctx.fillRect(0,0,c_w,c_h);  
	ctx.restore();

	//
	ctx.save();             
	ctx.beginPath();
	ctx.arc(posx_l, posy_l, 0.99*radius, 0, 6.28, false);            
	ctx.closePath();
	ctx.clip(); 
	ctx.drawImage(img_l, -128*pos[rdm_seed[1]][0]-half_w+posx_l,
		         -128*pos[rdm_seed[1]][1]-half_h+posy_l);
	ctx.restore();

	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx_l, posy_l, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad_l;
	ctx.fillRect(0,0,c_w,c_h);
	ctx.restore();

	//
	ctx.save(); 
	ctx.beginPath();
	ctx.arc(posx_r, posy_r, 0.99*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip(); 
	ctx.drawImage(img_r, -128*pos[rdm_seed[2]][0]-half_w+posx_r,
		         -128*pos[rdm_seed[2]][1]-half_h+posy_r);
	ctx.restore();

	ctx.save();
	ctx.beginPath();            
	ctx.arc(posx_r, posy_r, 1*radius, 0, 6.28, false);
	ctx.closePath();
	ctx.clip();
	ctx.fillStyle = grad_r;
	ctx.fillRect(0,0,c_w,c_h);
	ctx.restore();


	let all_data = ctx.getImageData(0, 0, c_w, c_h);
	adjust_gamma(all_data.data);
	ctx.putImageData(all_data, 0, 0);    
}


//
function save_data_mlds(){
	var name1 = data_directory+'data_'+id+'_mlds_'+exp_id+'.csv';
	var data1 = jsPsych.data.get().filter(
			[{save_type: 'response_mlds'}]).csv();
	var name2 = data_directory+'data_'+id+'_mlds_train_'+exp_id+'.csv';
	var data2 = jsPsych.data.get().filter(
			[{save_type: 'response_mlds_train'}]).csv();
	var name3 = data_directory+'comments_'+id+'_mlds_'+exp_id+'.csv';
	var data3 = comments_mlds;
	_save_data(name1, data1);
	_save_data(name2, data2); 
	_save_data(name3, data3);
}

//
function send_email_mlds(){
	var name1 = 'data_'+id+'_mlds_'+exp_id+'.csv';
	var dataUri1 = "data:" + "text/csv" + ";base64," 
		+ btoa(jsPsych.data.get().filter([
			{save_type: 'response_mlds'}]).csv());

		    
	var name2 = 'data_'+id+'_mlds_train_'+exp_id+'.csv';
	var dataUri2 = "data:" + "text/csv" + ";base64," 
		+ btoa(jsPsych.data.get().filter([
			{save_type: 'response_mlds_train'}]).csv());

	var name3 = 'comments_'+id+'_mlds_'+exp_id+'.csv';
	var dataUri3 = "data:" + "text/csv" + ";base64," + btoa(comments_mlds);

	var name4 = 'screen_calibration_'+id+'_mlds_'+exp_id+'.csv';
	var dataUri4 = "data:" + "text/csv" + ";base64,"
		+ btoa(jsPsych.data.get().filter([
			{save_type: 'response_calibration'},
			{save_type: 'response_consent'}]).csv());	
	
	Email.send({
	    SecureToken: token,
	    To : 'surname1.name1@somewhere.com',
	    From : 'surname2.name2@somewhereelse.com',
	    Subject : '[XP] MLDS | Participant ID: '+id+' | Exp ID: '+exp_id,
	    Body : '<html><h3>Experimental Results</h2>'+
		   '<p>Participant ID: '+id+'</p>'+
		   '<p>Experiment ID: '+exp_id+'</p>'+
		   '<p>'+comments_mlds+'</p>',
	    Attachments : [{
		                name : name1,
		                data : dataUri1
		            },
		            {
		                name : name2,
		                data : dataUri2
		            },
		            {
		                name : name3,
		                data : dataUri3
		            },
					{
		                name : name4,
		                data : dataUri4
		            }]
	})
}

