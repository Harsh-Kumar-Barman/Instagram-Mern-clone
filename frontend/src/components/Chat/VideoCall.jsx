import React, { useEffect, useRef, useState } from 'react';

const VideoCall = ({ userId, remoteUserId, socketRef }) => {
//   const [socket, setSocket] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {

    socketRef.current.on('videoCallOffer', async ({ from, offer }) => {
      await handleVideoCallOffer(from, offer);
    });

    socketRef.current.on('videoCallAnswer', async ({ from, answer }) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socketRef.current.on('iceCandidate', async ({ from, candidate }) => {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => socketRef.current.disconnect();
  }, [userId]);

  const startCall = async () => {
    peerConnection.current = new RTCPeerConnection();

    // Get local video and audio
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;

    localStream.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream));

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('iceCandidate', { to: remoteUserId, candidate: event.candidate });
      }
    };

    // Create SDP offer
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socketRef.current.emit('videoCallOffer', { to: remoteUserId, offer });
  };

  const handleVideoCallOffer = async (from, offer) => {
    peerConnection.current = new RTCPeerConnection();

    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;

    localStream.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream));

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('iceCandidate', { to: from, candidate: event.candidate });
      }
    };

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

    // Create SDP answer
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socketRef.current.emit('videoCallAnswer', { to: from, answer });
  };

  return (
    <div>
      <div>
        <video ref={localVideoRef} autoPlay playsInline />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default VideoCall;
