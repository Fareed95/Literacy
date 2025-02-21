'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { useUserContext } from '@/app/context/Userinfo';
import { motion } from 'framer-motion';

const page = () => {
  const { room } = useParams();
  const [name, setName] = useState('');
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
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
      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 mt-[5%]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Participants Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6"
          >
            <h3 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Active Participants
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {users.map((user, index) => (
                <motion.span 
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-neutral-800/50 border border-neutral-700 px-6 py-2 rounded-full text-neutral-200 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {user.name || 'Anonymous'}
                </motion.span>
              ))}
            </div>
          </motion.div>
          
          {/* Video Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Local Video */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full aspect-video bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  You ({name})
                </div>
              </div>
            </motion.div>

            {/* Remote Video */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full aspect-video bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {users.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    {users[0]?.name || 'Remote Participant'}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <motion.button 
              onClick={endCall}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 font-medium px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              End Call
            </motion.button>
          </motion.div>
        </div>
      </div>
    ) : (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            Please Login First
          </h1>
          <p className="text-neutral-400">
            You need to be logged in to join this video call
          </p>
        </motion.div>
      </div>
    )
  );
};

export default page;
