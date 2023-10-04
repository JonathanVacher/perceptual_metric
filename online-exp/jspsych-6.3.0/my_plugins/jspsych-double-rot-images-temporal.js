/**
 * jspsych-double-rot-images-temporal
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["double-rot-images-temporal"] = (function() {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('double-rot-images-temporal', 'stimulus',
                                      'image');

    plugin.info = {
        name: 'double-rot-images-temporal',
        description: '',
        parameters: {
            disp_func: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Display function',
                default: undefined,
                description: 'The function to be called with the canvas ID. '+
                  'This should handle drawing operations. The return value '+
                  ' of this function is stored in trial.stimulus_properties, '+
                  'which is useful for recording particular properties of '+
                  'the stimulus which are only calculated at runtime.'                
            },
            stimulus: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: 'Stimulus',
                default: undefined,
                description: 'The reference images to be displayed'
                            +'(should be [[ref1,...,refn],[test1,...testn]]'
            },
            mask: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Mask or no mask.',
                default: false,
                description: 'If true, display a mask between stimulus.'
            },
            mask_images: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: 'Mask images',
                default: undefined,
                description: 'The mask images to be displayed'
            },
            radius: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus radius',
                default: 80,
                description: 'Radius of the stimulus.'
            },
            doublet: {
                type: jsPsych.plugins.parameterType.INT, 
                pretty_name: 'Tested doublet',
                default: [0,1],
                description: 'The tested doublet.'
            },
            trialId: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Id of the tested doublet',
                default: 0,
                description: 'Id of the tested doublet.'+
                'This is required for responses gathering.'
            },
            randomize: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'First-second randomization',
                default: 'rdm',
                description: 'If rdm, first-second stimuli position '+
                	'are randomized. Otherwise it is 01 or 10.'
            },
            canvasId: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Canvas ID',
                default: false,
                description: 'ID for the canvas. Only necessary when '+
                  'supplying canvasHTML. This is required so that the ID '+
                  'can be passed to the stimulus function.'
            },
            canvasWidth: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Canvas width',
                default: 400,
                description: 'Sets the width of the canvas.'
            },
            canvasHeight: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Canvas height',
                default: 400,
                description: 'Sets the height of the canvas.'
            },
            choices: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                array: true,
                pretty_name: 'Choices',
                default: jsPsych.ALL_KEYS,
                description: 'The keys the subject is allowed to press to '
                                +'respond to the stimulus.'
            },
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Prompt',
                default: null,
                description: 'Any content here will be displayed below '
                                +'the stimulus.'
            },
            stimulus_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus duration',
                default: null,
                description: 'How long to hide the stimulus.'
            },
            inter_stimulus_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'inter_stimulus duration',
                default: null,
                description: 'How long to show the stimulus.'
            },
            mask_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'mask duration',
                default: null,
                description: 'How long to show the mask.'
            },
            post_trial_gap: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial over duration',
                default: null,
                description: 'How long to show trial after the stimulus '
                                +'before it ends.'
            },

            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: true,
                description: 'If true, trial will end when subject makes '
                                +'a response.'
            },
        }
    }

    plugin.trial = function(display_element, trial) {

        var idx = [0,1];
        var mask_idx = Array.from(Array(trial.mask_images.length).keys());
        var rdm_mask_idx = jsPsych.randomization.shuffle(mask_idx);
        rdm_mask_idx = rdm_mask_idx.slice(0,2);
        var stim_idx = Array.from(Array(trial.stimulus[0].length).keys());
        var rdm_stim_idx = jsPsych.randomization.shuffle(stim_idx);
        rdm_stim_idx = rdm_stim_idx.slice(0,2);

        if(trial.randomize=='rdm'){
        	var first_second_idx = jsPsych.randomization.shuffle(idx);
        } 
        else if(trial.randomize=='01'){
        	var first_second_idx = idx;
        }
        else if(trial.randomize=='10'){
            var first_second_idx = [1,0];
        }
        
        
        // display stimulus        
        let canvas = '';
        // Use the supplied HTML for constructing the canvas, if supplied
        if(trial.canvasId !== false) {
            canvas = trial.canvasHTML;
        } else {
            // Otherwise create a new default canvas
            trial.canvasId = '#jspsych-double-rot-images-temporal';
            canvas = '<canvas id="'+trial.canvasId+'" height="'
            +trial.canvasHeight+'" width="'+trial.canvasWidth+'"></canvas>';
        }
        var html = '<img id="im0" width="256" height="256" src="'
                    +trial.stimulus[first_second_idx[0]][rdm_stim_idx[0]]
                    +'"style="display:none">';

        html += '<img id="im1" width="256" height="256" src="'
                    +trial.stimulus[first_second_idx[1]][rdm_stim_idx[1]]
                    +'"style="display:none">';

        if(trial.mask == true){
			html += '<img id="mask0" width="256" height="256" src="'
						        +trial.mask_images[rdm_mask_idx[0]]
                                +'"style="display:none">';
			html += '<img id="mask1" width="256" height="256" src="'
						        +trial.mask_images[rdm_mask_idx[1]]
                                +'"style="display:none">';

		}
        html += '<div id="jspsych-double-rot-images-temporal">'+canvas+'</div>';

        
        if (trial.prompt !== null){
            html += trial.prompt;
        }

        display_element.innerHTML = html;

        // store response
        var response = {
            rt: null,
            key: null,
            stimulus: null
        };

        var rotations = [trial.doublet[first_second_idx[0]],
                         trial.doublet[first_second_idx[1]]]
		var imgs = ["im0","im1"];
		if(trial.mask == true){
			var mask_imgs = ["mask0","mask1"];
		}
		else{
			var mask_imgs =[];
		}
        // Execute the supplied drawing function
        response.stimulus = trial.disp_func(trial.canvasId,
                                            imgs, mask_imgs, rotations,
                                            trial.stimulus_duration,
                                            trial.inter_stimulus_duration,
                                            trial.mask_duration,
                                            trial.mask,
                                            trial.radius);
        
        // function to end trial when it is time
        var end_trial = function() {
            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // kill keyboard listeners
            if (typeof keyboardListener !== 'undefined') {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }

            // gather the data to store for the trial
            var trial_data = {
                "rt": response.rt,
                "stimulus": trial.stimulus,
                "key_press": response.key,
                "first_second_idx": first_second_idx,
                "rdm_stim_idx": rdm_stim_idx
            };

            // clear the display
            display_element.innerHTML = '';

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        };

        // function to handle responses by the subject
        var after_response = function(info) {

            // after a valid response, the stimulus will
            // have the CSS class 'responded'
            // which can be used to provide visual feedback
            // that a response was recorded
            display_element.querySelector('#jspsych-double-rot-images-temporal')
                            .className += ' responded';

            // only record the first response
            if (response.key == null) {
                response = info;
            }

            if (trial.response_ends_trial) {
                end_trial();
            }
        };

        // start the response listener
        if (trial.choices != jsPsych.NO_KEYS) {
            var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: after_response,
                    valid_responses: trial.choices,
                    rt_method: 'performance',
                    persist: false,
                    allow_held_key: false
                });
        }

        // hide stimulus if stimulus_duration is set
        if (trial.stimulus_duration !== null) {
            jsPsych.pluginAPI.setTimeout(
                function() {
                    display_element.querySelector(
                        '#jspsych-double-rot-images-temporal')
                        .style.visibility = 'hidden';
                },
                2*(trial.stimulus_duration+trial.mask_duration+50
                    +trial.inter_stimulus_duration)+200
            );
        }

        // end trial if trial_duration is set
        if (trial.trial_over_duration !== null) {
            jsPsych.pluginAPI.setTimeout(
                function() {
                end_trial();
                },
                2*(trial.stimulus_duration+trial.mask_duration+50
                    +trial.inter_stimulus_duration)+200+trial.post_trial_gap
            );
        }

    };

    return plugin;
})();
