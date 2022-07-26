import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import UserVideoComponent from "./UserVideoComponent";

const OPENVIDU_SERVER_URL = "https://" + window.location.hostname + ":4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const OpenViduTest = () => {
  const [state, setState] = useState({
    mySessionId: "SessionA",
    myUserName: "Participant" + Math.floor(Math.random() * 100),
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
  });

  function handleChangeSessionId(e) {
    setState((prev) => ({
      ...prev,
      mySessionId: e.target.value,
    }));
  }

  function handleChangeUserName(e) {
    this.setState((prev) => ({
      ...prev,
      myUserName: e.target.value,
    }));
  }

  function handleMainVideoStream(stream) {
    if (state.mainStreamManager !== stream) {
      setState((prevState) => ({
        ...prevState,
        mainStreamManager: stream,
      }));
    }
  }

  function deleteSubScriber(streamManager) {
    let subscribers = state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      setState((prevState) => ({
        ...prevState,
        subscribers: subscribers,
      }));
    }
  }
  let OV = new OpenVidu();
  function joinSession(e) {
    e.preventDefault();
    OV = new OpenVidu();

    setState(
      (prevState) => ({
        ...prevState,
        session: OV.initSession(),
      }),
      () => {}
    );

    console.log(state);
  }

  useEffect(() => {
    if (state.session !== undefined) {
      let mySession = state.session;

      console.log(state.session);
      console.log(state.subscribers);
      mySession.on("streamCreated", (event) => {
        let subscriber = mySession.subscribe(event.stream, undefined);
        let subscribers = state.subscribers;
        subscribers.push(subscriber);

        setState((prevState) => ({
          ...prevState,
          subscribers: subscribers,
        }));
      });
      mySession.on("exception", (exception) => {
        console.warn(exception);
      });
      function getToken() {
        return createSession(state.mySessionId).then((sessionId) =>
          createToken(sessionId)
        );
      }
      getToken().then((token) => {
        mySession
          .connect(token, { clientData: state.myUserName })
          .then(async () => {
            let devices = await OV.getDevices();
            let videoDevices = devices.filter(
              (device) => device.kind === "videoinput"
            );
            let publisher = OV.initPublisher(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: videoDevices[0].deviceId, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: "640x480", // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: true, // Whether to mirror your local video or not
            });

            // --- 6) Publish your stream ---

            mySession.publish(publisher);

            // Set the main video in the page to display our webcam and store our Publisher
            setState((prevState) => ({
              ...prevState,
              currentVideoDevice: videoDevices[0],
              mainStreamManager: publisher,
              publisher: publisher,
            }));
          })
          .catch((error) => {
            console.log(
              "세션에 연결할 수 없습니다.:",
              error.code,
              error.message
            );
          });
      });
    }
  }, [
    OV,
    state.mySessionId,
    state.myUserName,
    state.session,
    state.subscribers,
  ]);

  function leaveSession() {
    const mySession = state.session;

    if (mySession) {
      mySession.disconnect();
    }
    OV = null;

    setState({
      session: undefined,
      subscrubers: [],
      mySessionId: "SessionA",
      myUserName: "Participant" + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined,
    });
  }
  useEffect(() => {
    if (state.session !== undefined) {
      const mySession = state.session;

      if (mySession) {
        mySession.disconnect();
      }
      OV = null;

      setState({
        session: undefined,
        subscrubers: [],
        mySessionId: "SessionA",
        myUserName: "Participant" + Math.floor(Math.random() * 100),
        mainStreamManager: undefined,
        publisher: undefined,
      });
    }
  }, []);
  async function switchCamera() {
    try {
      const devices = await OV.getDevices();
      let videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        let newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          let newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await state.session.unpublish(state.mainStreamManager);

          await state.session.publish(newPublisher);
          setState((prevState) => ({
            ...prevState,
            currentVideoDevice: newVideoDevice,
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      {state.session === undefined ? (
        <div>
          테스트입니다
          <input
            id="userName"
            type="text"
            value={state.myUserName}
            onChange={handleChangeUserName}
          />
          <input
            type="text"
            id="sessionId"
            value={state.mySessionId}
            onChange={handleChangeSessionId}
          />
          <button onClick={joinSession}>입장하기</button>
        </div>
      ) : null}
      {state.session !== undefined ? (
        <div>
          <div>{state.mySessionId}</div>
          <div>
            <button onClick={leaveSession}>세션 나가기</button>
          </div>
          {state.mainStreamManager !== undefined ? (
            <div className="col-md-6">
              <UserVideoComponent streamManager={state.mainStreamManager} />
              <button onClick={switchCamera}> 카메라 변경 </button>
            </div>
          ) : null}
          <div>
            {state.publisher !== undefined ? (
              <div onClick={() => handleMainVideoStream(state.publisher)}>
                <UserVideoComponent streamManager={state.publisher} />
              </div>
            ) : null}
            {state.subscribers &&
              state.subscribers.map((sub, i) => (
                <div
                  className="col-md-6"
                  key={i}
                  onClick={() => handleMainVideoStream(sub)}
                >
                  test
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );

  /*


  서버사이드!!!!!


  */
  // 서버에서 해야 할꺼임!

  function createSession(sessionId) {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  }

  function createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
};

export default OpenViduTest;