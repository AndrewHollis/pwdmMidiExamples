//TODO Add timer to Audition button, needs to turn off after maybe 200ms

//TODO Add function to change A3k program/sample names.



var midiAccess = null;  // global MIDIAccess object
var outputPort;

function onMIDISuccess(midiAccess){
    console.log( "MIDI ready!" );
    midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
    displayOutputs(midi);
}

function onMIDIFailure(msg) {
    console.log( "Failed to get MIDI access - " + msg );
}

navigator.requestMIDIAccess({sysex: true}).then( onMIDISuccess, onMIDIFailure );

function displayOutputs(midi){
    var outputs = midi.outputs,
        selectOutput = document.getElementById("listOutputs"),
        fragment2 = document.createDocumentFragment();

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

function selectOutputIndex() {
    var x = document.getElementById("listOutputs").selectedIndex;
    outputPort = midi.outputs.get(x);
    document.getElementById("messageBox").innerHTML = "Port Selected:" + outputPort.name;
    //console.log(outputPort.name);
}

//Todo Add sendTextMessage

/*    function sendMessage(){
         var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
         var ccMessage = [0xB0, 60, 0x7f];    // CC
         var sysex = [240, 126, 127, 6, 1, 247];
         outputPort.send(sysex);
         outputPort.send( noteOnMessage );
         outputPort.send( ccMessage );
 }*/

function sendMessage(message){
    try {
        //console.log(message);
        outputPort.send(message);
    } catch (e) {
        document.getElementById("messageBox").innerHTML = "Please select a output port!";
    }

    
}

function sendTextMessage(message){
    outputPort.send();
}

