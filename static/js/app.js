const root = document.getElementById("root");
const usernameInput = document.getElementById("username");
const button = document.getElementById("join_leave");
const shareScreen = document.getElementById("share_screen");
const settingBtn = document.getElementById("settingBtn");

// const toggleChat = document.getElementById('toggle_chat');
const container = document.getElementById("container");
const containerOfparticipant = document.getElementById(
  "containerOfparticipantAppend"
);

const count = document.getElementById("count");
const chatScroll = document.getElementById("chat-scroll");
// const chatContent = document.getElementById("chat-content");
// const chatInput = document.getElementById('chat-input');
let connected = false;
let room;
let chat;
let conv;
let screenTrack;

const audioEnabledIcon = `
  <svg xmlns="https://www.w3.org/2000/svg" class="iconButtonMik" width="12" height="17" viewBox="0 0 12 17">
    <path
      fill="#ffffff"
      fillRule="evenodd"
      d="M11.389 6.667c.276 0 .5.224.5.5 0 3.114-2.396 5.67-5.445 5.923v2.632c0 .276-.223.5-.5.5-.245 0-.45-.177-.491-.41l-.009-.09V13.09C2.395 12.836 0 10.281 0 7.167c0-.276.224-.5.5-.5s.5.224.5.5c0 2.73 2.214 4.944 4.944 4.944 2.731 0 4.945-2.214 4.945-4.944 0-.276.224-.5.5-.5zM5.944 0C7.51 0 8.778 1.268 8.778 2.833v4.334C8.778 8.73 7.51 10 5.944 10 4.38 10 3.111 8.73 3.111 7.167V2.833C3.111 1.268 4.38 0 5.944 0zm0 1c-1.012 0-1.833.82-1.833 1.833v4.334C4.111 8.179 4.933 9 5.944 9c1.013 0 1.834-.82 1.834-1.833V2.833C7.778 1.82 6.958 1 5.944 1z"
    />
  </svg>
`;
const audioDisabledIcon = `
<svg xmlns="https://www.w3.org/2000/svg" className={classes.iconStyle} width="25" height="24" viewBox="0 0 25 24">
<g fill="none" fillRule="evenodd">
  <path
    fill="#ffffff"
    d="M11.889 6.667c.276 0 .5.224.5.5 0 3.114-2.396 5.67-5.445 5.923v2.632c0 .276-.223.5-.5.5-.245 0-.45-.177-.491-.41l-.009-.09V13.09c-1.116-.093-2.145-.494-3-1.119l.717-.717c.793.54 1.751.857 2.783.857 2.731 0 4.945-2.214 4.945-4.944 0-.276.224-.5.5-.5zM1 6.667c.276 0 .5.224.5.5 0 .975.282 1.884.77 2.65l-.722.721C.888 9.58.5 8.418.5 7.167c0-.276.224-.5.5-.5zm8.277-1.031v1.53C9.278 8.732 8.01 10 6.445 10c-.446 0-.868-.103-1.243-.287l.776-.773c.149.039.306.06.467.06.963 0 1.751-.74 1.828-1.683l.006-.15v-.531l1-1zM6.444 0C8.01 0 9.278 1.268 9.278 2.833l-.002-.025-.999.999v-.974c0-.962-.74-1.75-1.682-1.827L6.445 1c-.962 0-1.751.74-1.828 1.683l-.006.15v4.334c0 .097.008.192.022.285l-.804.805c-.112-.269-.184-.558-.209-.86l-.009-.23V2.833C3.611 1.268 4.88 0 6.444 0z"
    transform="translate(6.5 4)"
  />
  <path
    fill="red"
    d="M12.146.646c.196-.195.512-.195.708 0 .173.174.192.443.057.638l-.057.07-12 12c-.196.195-.512.195-.708 0-.173-.174-.192-.443-.057-.638l.057-.07 12-12z"
    transform="translate(6.5 4)"
  />
</g>
</svg>
`;
const videoEnabledIcon = `
<svg xmlns="https://www.w3.org/2000/svg" className={classes.iconStyle} width="25" height="24" viewBox="0 0 25 24">
<path
  fill="#ffffff"
  fillRule="evenodd"
  d="M15.003 7c.665 0 1.206.542 1.206 1.207v1.349l3.58-1.789c.301-.15.652.04.704.358l.007.082v7.866c0 .365-.385.603-.711.44l-3.58-1.79v1.35c0 .623-.476 1.138-1.083 1.2l-.123.006H5.707c-.665 0-1.207-.542-1.207-1.206V8.207C4.5 7.542 5.042 7 5.707 7zm0 .983H5.707c-.122 0-.224.102-.224.224v7.866c0 .121.102.223.224.223h9.296c.122 0 .223-.102.223-.223V8.207c0-.122-.101-.224-.223-.224zm4.513 1.019l-3.307 1.654v2.968l3.307 1.653V9.002z"
/>
</svg>
`;
const videoDisabledIcon = `
<svg xmlns="https://www.w3.org/2000/svg" className={classes.iconStyle} width="24" height="24" viewBox="0 0 24 24">
<g fill="none" fillRule="evenodd">
  <path
    fill="#ffffff"
    d="M10.503.85c.32 0 .611.125.827.329l-.696.697c-.025-.018-.053-.032-.084-.038l-.047-.006H1.207c-.102 0-.19.071-.216.165l-.008.059v7.866c0 .101.07.189.165.215l.059.008h1.156l-.983.983h-.173c-.624 0-1.139-.476-1.2-1.083L0 9.922V2.056C0 1.433.476.917 1.084.856l.123-.007h9.296zm5.49 1.124l.007.082v7.866c0 .337-.328.566-.635.47l-.076-.03-3.58-1.79v1.35c0 .623-.476 1.138-1.083 1.2l-.123.006H4.16l.984-.983h5.359c.101 0 .189-.07.215-.164l.008-.06V4.564l.983-.982.353-.353 3.227-1.612c.301-.15.652.04.704.358zm-.977.876L11.71 4.504v2.967l3.307 1.654V2.85z"
    transform="translate(4 6)"
  />
  <path
    fill="red"
    fillRule="nonzero"
    d="M13.06.144c.192-.192.503-.192.695 0 .171.17.19.436.057.627l-.057.068-12.29 12.29c-.192.193-.503.193-.695 0-.171-.17-.19-.435-.057-.626l.057-.069L13.06.144z"
    transform="translate(4 6)"
  />
</g>
</svg>
`;
let videoIcon = videoEnabledIcon;
let audioIcon = audioEnabledIcon;

function loadDevicesControlls(room) {
  let videoToogleBtn = `
      <button type="button" class="btnIconsStyle" id="cameraToogleBtn" value="OFF" onclick="toogleCamera(this);">
       ${videoIcon}
      </button>
    `;
  let AudioToogleBtn = `
    <button type="button" class="btnIconsStyle" id="audioToogleBtn" value="OFF" onclick="toogleAudio(this);">
     ${audioIcon}
    </button>
  `;
  $("#conOfDevicesContreoll").append(videoToogleBtn);
  $("#conOfDevicesContreoll").append(AudioToogleBtn);
}
function toogleCamera(button) {
  if (button.value == "OFF") {
    videoIcon = videoDisabledIcon;
    $("#cameraToogleBtn").html(videoIcon);
    button.value = "ON";
    $(".mutedVideo").removeClass("d-none-cus");
    room.localParticipant.videoTracks.forEach((publication) => {
      publication.track.disable();
    });
  } else {
    videoIcon = videoEnabledIcon;
    $("#cameraToogleBtn").html(videoIcon);
    button.value = "OFF";
    $(".mutedVideo").addClass("d-none-cus");

    room.localParticipant.videoTracks.forEach((track) => {
      track.track.enable();
    });
  }
}
function toogleAudio(button) {
  if (button.value == "OFF") {
    audioIcon = audioDisabledIcon;
    $("#audioToogleBtn").html(audioIcon);
    button.value = "ON";
    room.localParticipant.audioTracks.forEach((track) => {
      track.track.disable();
    });
  } else {
    audioIcon = audioEnabledIcon;
    $("#audioToogleBtn").html(audioIcon);
    button.value = "OFF";
    room.localParticipant.audioTracks.forEach((track) => {
      track.track.enable();
    });
  }
}

function addLocalVideo() {
  Twilio.Video.createLocalVideoTrack().then((track) => {
    // let video = document.getElementById("local").firstChild;
    let trackElement = track.attach();
    trackElement.addEventListener("click", () => {
      zoomTrack(trackElement);
    });
    $("#local-media").append(trackElement);
  });
}

function connectButtonHandler() {
  let searchParams = new URLSearchParams(window.location.search);
  let username;
  if (!connected) {
    if (searchParams.get("name")) {
      username = searchParams.get("name");
    }
    if (!username) {
      alert("Enter your name before connecting");
      return;
    }
    button.disabled = true;
    button.innerHTML = "Connecting...";
    connect(username)
      .then(() => {
        button.innerHTML = "Leave call";
        button.disabled = false;
        shareScreen.disabled = false;
        settingBtn.disabled = false;
      })
      .catch(() => {
        // alert("Connection failed. Is the backend running?");
        $("#modalAlert").modal("show");
        setTimeout(function() {
          $("#modalAlert").modal("hide");
        }, 3000);
        button.innerHTML = "Join call";
        button.disabled = false;
      });
  } else {
    disconnect();
    button.innerHTML = "Join call";
    connected = false;
    shareScreen.innerHTML = "Share screen";
    shareScreen.disabled = true;
    settingBtn.disabled = true;
  }
}

function connect(username) {
  let promise = new Promise((resolve, reject) => {
    // get a token from the back end
    let data;
    fetch("/login", {
      method: "POST",
      body: JSON.stringify({ username: username }),
    })
      .then((res) => res.json())
      .then((_data) => {
        // join video call
        data = _data;
        return Twilio.Video.connect(data.token, {
          room: room,
          audio: true,
          video: true,
        });
      })
      .then((_room) => {
        room = _room;
        room.on("participantConnected", participantConnected);
        loadDevicesControlls(room);
        $("#settingBtn").removeClass("d-none-cus");
        navigator.mediaDevices.enumerateDevices().then(gotDevices);
        const select = document.getElementById("video-devices");
        const selectAudio = document.getElementById("audio-devices");
        select.addEventListener("change", updateVideoDevice);
        selectAudio.addEventListener("change", updateAudioDevice);

        room.participants.forEach(participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        window.addEventListener("beforeunload", tidyUp(room));
        window.addEventListener("pagehide", tidyUp(room));
        connected = true;
        updateParticipantCount();
        resolve();
      })
      .catch((e) => {
        console.log(e);
        reject();
      });
  });
  return promise;
}

function updateParticipantCount() {
  if (!connected) count.innerHTML = "Disconnected.";
  else count.innerHTML = room.participants.size + 1 + " participants online.";
}
function tidyUp(room) {
  return function(event) {
    if (event.persisted) {
      return;
    }
    if (room) {
      room.disconnect();
      room = null;
    }
  };
}
function participantConnected(participant) {
  let participantDiv = document.createElement("div");
  participantDiv.setAttribute("id", participant.sid);
  participantDiv.setAttribute("class", "participant");

  let tracksDiv = document.createElement("div");
  participantDiv.appendChild(tracksDiv);

  let labelDiv = document.createElement("div");
  labelDiv.setAttribute("class", "label labelOfMyResource");
  labelDiv.innerHTML = participant.identity;
  participantDiv.appendChild(labelDiv);

  containerOfparticipant.appendChild(participantDiv);

  participant.tracks.forEach((publication) => {
    if (publication.isSubscribed) trackSubscribed(tracksDiv, publication.track);
  });
  participant.on("trackSubscribed", (track) => {
    trackSubscribed(tracksDiv, track);
  });
  participant.on("trackUnsubscribed", trackUnsubscribed);
  updateParticipantCount();
}

function participantDisconnected(participant) {
  document.getElementById(participant.sid).remove();
  updateParticipantCount();
  //   room.localParticipant.tracks.forEach(function(track) {
  //     track.stop();
  //   });
  window.location.href = "https://www.google.com/";
  room.disconnect();
}

function trackSubscribed(div, track) {
  let trackElement = track.attach();
  trackElement.addEventListener("click", () => {
    zoomTrack(trackElement);
  });
  div.appendChild(trackElement);
  shareScreenMode();
}

function trackUnsubscribed(track) {
  track.detach().forEach((element) => {
    if (element.classList.contains("participantZoomed")) {
      zoomTrack(element);
    }
    element.remove();
    shareScreenMode();
  });
}
function shareScreenMode() {
  console.log("screenTrack", screenTrack);
  let isShareScreenExist = $("#containerOfparticipantAppend video:eq(1)");
  if (isShareScreenExist.length > 0) $("body").addClass("screenSharingMode");
  else $("body").removeClass("screenSharingMode");
}
function disconnect() {
  room.disconnect();
  if (chat) {
    chat.shutdown().then(() => {
      conv = null;
      chat = null;
    });
  }
  while (container.lastChild.id != "local") {
    container.removeChild(container.lastChild);
    window.location.href = "https://www.google.com/";
    room.disconnect();
    // room.localParticipant.tracks.forEach(function(track) {
    //   track.stop();
    // });
  }
  button.innerHTML = "Join call";
  if (root.classList.contains("withChat")) {
    root.classList.remove("withChat");
  }
  // toggleChat.disabled = true;
  connected = false;
  updateParticipantCount();
}

function shareScreenHandler() {
  //   event.preventDefault();
  if (!screenTrack) {
    navigator.mediaDevices
      .getDisplayMedia()
      .then((stream) => {
        screenTrack = new Twilio.Video.LocalVideoTrack(stream.getTracks()[0]);
        room.localParticipant.publishTrack(screenTrack);
        screenTrack.mediaStreamTrack.onended = () => {
          shareScreenHandler();
        };
        console.log(screenTrack);
        shareScreen.innerHTML = "Stop sharing";
      })
      .catch(() => {
        alert("Could not share the screen.");
      });
  } else {
    room.localParticipant.unpublishTrack(screenTrack);
    screenTrack.stop();
    screenTrack = null;
    shareScreen.innerHTML = "Share screen";
    console.log("screenTrack");
  }
}

function zoomTrack(trackElement) {
  if (!trackElement.classList.contains("trackZoomed")) {
    // zoom in
    container.childNodes.forEach((participant) => {
      if (
        participant.classList &&
        participant.classList.contains("participant")
      ) {
        let zoomed = false;
        participant.childNodes[0].childNodes.forEach((track) => {
          if (track === trackElement) {
            track.classList.add("trackZoomed");
            zoomed = true;
          }
        });
        if (zoomed) {
          participant.classList.add("participantZoomed");
        } else {
          participant.classList.add("participantHidden");
        }
      }
    });
  } else {
    // zoom out
    container.childNodes.forEach((participant) => {
      if (
        participant.classList &&
        participant.classList.contains("participant")
      ) {
        participant.childNodes[0].childNodes.forEach((track) => {
          if (track === trackElement) {
            track.classList.remove("trackZoomed");
          }
        });
        participant.classList.remove("participantZoomed");
        participant.classList.remove("participantHidden");
      }
    });
  }
}
// Detach the Participant's Tracks from the DOM.
function detachParticipantTracks(participant) {
  var tracks = Array.from(participant.tracks.values()).map(function(
    trackPublication
  ) {
    return trackPublication.track;
  });
  detachTracks(tracks);
}

function gotDevices(mediaDevices) {
  const select = document.getElementById("video-devices");
  const selectAudio = document.getElementById("audio-devices");
  select.innerHTML = "";
  selectAudio.innerHTML = "";
  select.appendChild(document.createElement("option"));
  selectAudio.appendChild(document.createElement("option"));
  let count = 1;
  let countAudio = 1;
  mediaDevices.forEach((mediaDevice) => {
    if (mediaDevice.kind === "videoinput") {
      const option = document.createElement("option");
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      select.appendChild(option);
    }
    if (mediaDevice.kind === "audioinput") {
      const option = document.createElement("option");
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `audio ${countAudio++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      selectAudio.appendChild(option);
    }
  });
}
// Attach the Tracks to the DOM.
function attachTracks(tracks, container) {
  tracks.forEach(function(track) {
    if (track) {
      container.appendChild(track.attach());
    }
  });
}
// Detach the Tracks from the DOM.
function detachTracks() {
  $("#local-media video").remove();
}
function stopTracks(tracks) {
  tracks.forEach(function(track) {
    if (track) {
      track.stop();
    }
  });
}
function updateAudioDevice(event) {
  const select = event.target;
  const localParticipant = room.localParticipant;
  if (select.value !== "") {
    const tracks = Array.from(localParticipant.audioTracks.values()).map(
      function(trackPublication) {
        return trackPublication.track;
      }
    );

    localParticipant.unpublishTracks(tracks);

    // log(localParticipant.identity + ' removed track: ' + tracks[0].kind);
    detachTracks(tracks);

    stopTracks(tracks);
    Twilio.Video.createLocalVideoTrack({
      audio: true,
      video: { deviceId: select.value },
    }).then(function(localVideoTrack) {
      localParticipant.publishTrack(localVideoTrack);
      const previewContainer = document.getElementById("local-media");
      attachTracks([localVideoTrack], previewContainer);
      $("#modalSetting").modal("hide");
    });
  }
}
function updateVideoDevice(event) {
  const select = event.target;
  const localParticipant = room.localParticipant;
  if (select.value !== "") {
    const tracks = Array.from(localParticipant.videoTracks.values()).map(
      function(trackPublication) {
        return trackPublication.track;
      }
    );
    localParticipant.unpublishTracks(tracks);
    // log(localParticipant.identity + ' removed track: ' + tracks[0].kind);
    detachTracks(tracks);
    stopTracks(tracks);
    Twilio.Video.createLocalVideoTrack({
      deviceId: { exact: select.value },
    }).then(function(localVideoTrack) {
      localParticipant.publishTrack(localVideoTrack);
      // log(localParticipant.identity + ' added track: ' + localVideoTrack.kind);
      const previewContainer = document.getElementById("local-media");
      attachTracks([localVideoTrack], previewContainer);
      $("#modalSetting").modal("hide");
    });
  }
}

addLocalVideo();
connectButtonHandler();
button.addEventListener("click", function(event) {
  event.preventDefault();
  connectButtonHandler();
});
shareScreen.addEventListener("click", shareScreenHandler);
// toggleChat.addEventListener('click', toggleChatHandler);
// chatInput.addEventListener('keyup', onChatInputKey);
