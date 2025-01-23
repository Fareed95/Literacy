'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { useUserContext } from '@/app/context/Userinfo';

const page = () => {
  const { room } = useParams();
  const [name, setName] = useState('');
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioFile, setAudioFile] = useState(null); // To store audio file locally
  const { contextisLoggedIn, contextname } = useUserContext();

  // Automatically set name from context when logged in
  useEffect(() => {
    if (contextisLoggedIn && contextname && !isNameEntered) {
      setName(contextname);
      setIsNameEntered(true);
    }
  }, [contextisLoggedIn, contextname, isNameEntered]);

  useEffect(() => {
    if (isNameEntered) {
      const initSocket = io(`${process.env.NEXT_PUBLIC_VIDEOCALL_SERVER}`);
      setSocket(initSocket);

      // Emit join room with more explicit user info
      initSocket.emit('joinRoom', { 
        room, 
        user: { 
          name: name, 
          id: initSocket.id 
        } 
      });

      // Handle user joining
      initSocket.on('userJoined', ({ user }) => {
        if (user) {
          setUsers((prevUsers) => {
            // Prevent duplicate users
            const isUserExists = prevUsers.some(u => u.name === user.name);
            return isUserExists ? prevUsers : [...prevUsers, user];
          });
        }
      });

      // Initialize room users
      initSocket.on('roomUsers', ({ users: roomUsers }) => {
        if (roomUsers && Array.isArray(roomUsers)) {
          setUsers(roomUsers.map(user => ({
            name: user.name,
            id: user.id
          })));
        }
      });

      initSocket.on('offer', async (offer) => {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          initSocket.emit('answer', { 
            answer: peerConnection.current.localDescription, 
            room,
            user: { 
              name: name, 
              id: initSocket.id 
            }
          });
        }
      });

      initSocket.on('answer', async (answer) => {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      initSocket.on('ice-candidate', (candidate) => {
        if (peerConnection.current) {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      initSocket.on('callEnded', () => {
        endCall();
      });

      return () => {
        initSocket.disconnect();
      };
    }
  }, [isNameEntered, room, name]);

  // Start audio recording
  const startRecording = async (stream) => {
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      }
    };

    recorder.onstop = async () => {
      if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioFile(audioBlob); // Save Blob as audio file on the client

        // Optionally, create a download link for the user
        const url = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'audio_recording.webm'; // Give it a name
        link.click();

        // Reset audio chunks after storing the file
        setAudioChunks([]);
      }
    };

    recorder.start(); // Start recording without sending data every second
  };

  // Start the WebRTC call and audio recording
  const startCall = async () => {
    peerConnection.current = new RTCPeerConnection();

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { 
          candidate: event.candidate, 
          room,
          user: { 
            name: name, 
            id: socket.id 
          }
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream);
    });

    localVideoRef.current.srcObject = localStream;

    // Start audio recording
    startRecording(localStream);

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit('offer', { 
      offer, 
      room,
      user: { 
        name: name, 
        id: socket.id 
      }
    });
  };

  // End the call and stop audio recording
  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }

    if (socket) {
      socket.emit('endCall', { 
        room,
        user: { 
          name: name, 
          id: socket.id 
        }
      });
    }
  };

  // Automatically start call when logged in
  useEffect(() => {
    if (contextisLoggedIn && socket) {
      startCall();
    }
  }, [contextisLoggedIn, socket]);

  return (
    contextisLoggedIn ? (
      <div className="min-h-screen text-neutral-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-center mb-4">Participants:</h3>
            <div className="flex justify-center space-x-4">
              {users.map((user, index) => (
                <span 
                  key={index} 
                  className="bg-neutral-800 px-4 py-2 rounded-full text-neutral-300"
                >
                  {user.name || 'Anonymous'}
                </span>
              ))}
            </div>
          </div>
          
          <div className="sm:flex justify-center sm:space-x-8 mb-8">
            <div className="relative">
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-[90vw] sm:w-[500px] sm:h-[400px] bg-black rounded-3xl shadow-lg"
              ></video>
              <div className="absolute bottom-2 left-2 bg-neutral-800/70 px-3 py-1 rounded-full text-sm">
                You ({name})
              </div>
            </div>
            <br></br>
            <div className="relative">
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-[90vw] sm:w-[500px] sm:h-[400px] bg-black rounded-3xl shadow-lg"
              ></video>
              {users.length > 0 && (
                <div className="absolute bottom-2 left-2 bg-neutral-800/70 px-3 py-1 rounded-full text-sm">
                  {users[0]?.name || 'Remote Participant'}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={endCall} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              End Call
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center rounded-lg shadow-lg">
          <h1 className="text-9xl font-semibold text-neutral-100">Please Login First</h1>
        </div>
      </div>
    )
  );
};

export default page;
