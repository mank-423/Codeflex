"use client"

import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";



const GenerateProgramPage = () => {

  const [callActive, setCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const messageContentRef = useRef<HTMLDivElement>(null);

  // auto-scroll messages
  useEffect(()=>{
    if (messageContentRef.current){
      messageContentRef.current.scrollTop = messageContentRef.current.scrollHeight;
    }
  }, [messages])

  // navigate after call ends
  useEffect(()=> {
    if (callEnded){
      const redirectTimer = setTimeout(()=>{
        router.push('/profile');
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router])


  // setup event listeners for vapi
  useEffect(() => {

    const handleCallStart = () => {
      console.log("Call started")
      setIsConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setIsConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };
    
    const handleSpeechStart = () => {
      setIsSpeaking(true);
      console.log("AI started speaking");
    };

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      console.log("AI stopped speaking");
    };

    const handleMessage = (message: any) => {};

    const handleError = (error: any) => {
      console.log("Vapi error:", error);
      setIsConnecting(false);
      setCallActive(false);
    };

    vapi.on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError)

    // Cleanup event listeners
    return () => {
      vapi.off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError)
    }
  }, [])


  const toggleCall = async() => {
    if (callActive) vapi.stop();
    else{
      try {
        setIsConnecting(true);
        setMessages([]);
        setCallEnded(false);

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
          }
        });
      } catch (error) {
        
      }
    }
  }

  return (
    <div>GenerateProgramPage</div>
  )
}

export default GenerateProgramPage