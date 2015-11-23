var midiAccess = null;  // global MIDIAccess object
var html, inputPort, outputPort;

function onMIDISuccess( midiAccess ) {
    console.log( "MIDI ready!" );
    midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
    // for Debug
    //listInputsAndOutputs(midiAccess);
    DisplayInputsAndOutputs(midi);
}

function onMIDIFailure(msg) {
    console.log( "Failed to get MIDI access - " + msg );
}

navigator.requestMIDIAccess({sysex:true}).then( onMIDISuccess, onMIDIFailure );

function selectInputIndex() {
    var x = document.getElementById("listInputs").selectedIndex;
    inputPort = midi.inputs.get(x);
    console.log(inputPort);
    inputPort.onmidimessage = MIDIMessageEventHandler;    
    console.log("Selected Input Port: " + inputPort.name);
}

function selectOutputIndex() {
    var y = document.getElementById("listOutputs").selectedIndex;
    outputPort = midi.outputs.get(y);
    console.log("Selected Output Port: " + outputPort.name);
}

//TODO change so that midi port is connected on select: see guitest
function DisplayInputsAndOutputs(midiAccess) {
    var inputs = midiAccess.inputs,
        selectInput = document.getElementById("listInputs"),
        fragment = document.createDocumentFragment();

    // Add the inputs to the inputs selector drop down.
    for (var input of inputs)
    {
        var opt = document.createElement('option');
        opt.innerHTML = input[1].name;
        opt.value = input[1].id;
        fragment.appendChild(opt);
    }
    selectInput.appendChild(fragment);

    // Add outputs to drop down
    var outputs = midi.outputs,
      selectOutput = document.getElementById("listOutputs"),
      fragment2 = document.createDocumentFragment();

    if(outputs){ console.log("outputs present");}

    // Add the outputs to the outputs selector drop down.
    for (var output of outputs)
    {
        var opt2 = document.createElement('option');
        opt2.innerHTML = output[1].name;
        opt2.value = output[1].id;
        fragment2.appendChild(opt2);
    }
    selectOutput.appendChild(fragment2);
}

function listInputsAndOutputs( midiAccess ) {
    for (var entry of midiAccess.inputs) {
        var input = entry[1];

        console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
            "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
            "' version:'" + input.version + "'" );
    }
}


function MIDIMessageEventHandler(event) {
    data = event.data,
    //console.log("data: " + data[0]);

    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
    note = data[1],
    velocity = data[2] / 127;
    //console.log("Ch: " + channel);
    //console.log("cmd: " + cmd);
    //console.log("Type: " + type);

    var freq = frequencyFromNoteNumber(note);

    switch (type) {
        case 144: // noteOn message 
            if (velocity == 0) { //Some devices send a midi note On message with velocity set to 0 to represent note off
                synth.triggerRelease();
                break;
            } else {
                synth.triggerAttack(freq, null, velocity);
                break;
            }
        case 128: // noteOff message 
            synth.triggerRelease();
            break;
    }
}

function sendMessage(message) {  
    outputPort.send(message);
}

function frequencyFromNoteNumber(note) {
    //TODO Which algorithm to use? Test using Tuner
    return 440 * Math.pow(2, (note - 69) / 12);
    //return (440. * Math.exp(.057762265 * (f - 69.)));
}



