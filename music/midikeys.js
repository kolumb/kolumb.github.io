/*
 * Midikeys.js
 * > Turn your keyboard into a midi keyboard, compatible with the Web MIDI API.
 * Copyright 2012 Nick Thompson
 * MIT License
 */
(function (window, document, undefined) {

  // Keycode to MIDI note values
  var map = {};

  map[50]  = 73; // 2 C#5
  map[51]  = 75; // 3 D#5
  map[53]  = 78; // 5 F#5
  map[54]  = 80; // 6 G#5
  map[55]  = 82; // 7 A#5
  map[57]  = 85; // 9 C#6
  map[48]  = 87; // 0 D#6
  map[187]  = 90; // = D#6

  map[81]  = 72; // q C5
  map[87]  = 74; // w D5
  map[69]  = 76; // e E5
  map[82]  = 77; // r F5
  map[84]  = 79; // t G5
  map[89]  = 81; // y A5
  map[85]  = 83; // u B5
  map[73]  = 84; // i C6
  map[79]  = 86; // o D6
  map[80]  = 88; // p E6
  map[219] = 89; // [ F6
  map[221] = 91; // ] G6

  map[83]  = 61; // s C#4
  map[68]  = 63; // d D#4
  map[71]  = 66; // g F#4
  map[72]  = 68; // h G#4
  map[74]  = 70; // j A#4
  map[76]  = 73; // l C#5
  map[186] = 75; // ; D#5

  map[90]  = 60; // z C4
  map[88]  = 62; // x D4
  map[67]  = 64; // c E4
  map[86]  = 65; // v F4
  map[66]  = 67; // b G4
  map[78]  = 69; // n A4
  map[77]  = 71; // m B4
  map[188] = 72; // , C5
  map[190] = 74; // . D5
  map[191] = 76; // / E5

  // Keep track of keydown and keyup events so that the keydown event doesn't
  // send messages repeatedly until keyup.
  var flags = {};

  function sendMessage (e, command) {
    // Check the event key against the midi map.
    var note = map[ (typeof e.which === "number")? e.which : e.keyCode ];

    // If the key doesn't exist in the midi map, or we're trying to send a
    // noteOn event without having most recently sent a noteOff, end here.
    if (note === undefined || (flags[note] && command === 0x9)) {
      return false;
    }

    // Build the data
    var data = new Uint8Array(3);

    data[0] = (command << 4) + 0x00;  // Send the command on channel 0
    data[1] = note;                   // Attach the midi note
    data[2] = 127;                    // Keyboard keys default to 127 velocity.

    // Package the message
    var msg = {
      data: data,
      timestamp: 0,
      shiftKey: e.shiftKey
    };

    // Send it
    api.onmessage.call(window, [msg]);

    // Update the flag table
    if (command === 0x9) {
      flags[note] = true;
    } else {
      flags[note] = false;
    }
  }

  document.addEventListener("keydown", function (e) {
    sendMessage(e, 0x09);
  });

  document.addEventListener("keyup", function (e) {
    sendMessage(e, 0x08);
  });

  // MIDIKeys api object, to be exposed as window.Keys
  var api = {

    // Expose the onmessage parameter like on a MIDIInput object
    onmessage: null

  };

  window.MIDIKeys = api;

})(this, this.document);