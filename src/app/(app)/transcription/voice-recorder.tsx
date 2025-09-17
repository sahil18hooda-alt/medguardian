"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, StopCircle, Clipboard, ClipboardCheck, AlertTriangle, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clinicalNoteTranscription } from "@/ai/flows/clinical-note-transcription";
import { cn } from "@/lib/utils";

type RecordingState = "idle" | "getting-mic" | "recording" | "stopped" | "transcribing" | "success" | "error";

export function VoiceRecorder() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [transcription, setTranscription] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup function to stop recording if component unmounts
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setRecordingState("getting-mic");
    setTranscription("");
    setIsCopied(false);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({ variant: "destructive", title: "Error", description: "Media Devices API not supported in this browser." });
        setRecordingState("error");
        return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setRecordingState("recording");
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setRecordingState("transcribing");
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const result = await clinicalNoteTranscription({ audioDataUri: base64Audio });
            setTranscription(result.transcription);
            setRecordingState("success");
          } catch (error) {
            console.error("Transcription failed:", error);
            toast({ variant: "destructive", title: "Transcription Failed", description: "Could not transcribe the audio." });
            setRecordingState("error");
          }
        };
        // Clean up stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({ variant: "destructive", title: "Microphone Access Denied", description: "Please allow microphone access to use this feature." });
      setRecordingState("error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecordingState("stopped");
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
    setIsCopied(true);
    toast({ title: "Copied!", description: "The transcription has been copied to your clipboard." });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "getting-mic" || recordingState === "stopped" || recordingState === "transcribing";

  return (
    <Card>
      <CardContent className="p-6 grid gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-8 bg-muted/50 rounded-lg">
            {!isRecording && !isProcessing && (
                <Button size="lg" onClick={startRecording}>
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                </Button>
            )}

            {(isRecording || isProcessing) && (
                 <Button size="lg" onClick={stopRecording} variant="destructive" disabled={!isRecording}>
                     {isRecording ? <StopCircle className="mr-2 h-5 w-5" /> : <Square className="mr-2 h-5 w-5" />}
                     {isRecording ? "Stop Recording" : "Recording Paused"}
                 </Button>
            )}

            <div className="flex items-center gap-2 text-muted-foreground">
                {isRecording && <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />}
                <span>
                {
                    {
                        "idle": "Ready to record",
                        "getting-mic": "Accessing microphone...",
                        "recording": "Recording...",
                        "stopped": "Processing...",
                        "transcribing": "Transcribing audio...",
                        "success": "Transcription complete",
                        "error": "An error occurred"
                    }[recordingState]
                }
                </span>
                {(isProcessing) && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
        </div>

        {(recordingState === 'success' || transcription) && (
            <div>
                <CardHeader className="px-0">
                    <CardTitle className="flex justify-between items-center">
                        <span>Generated Clinical Note</span>
                        <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!transcription}>
                            {isCopied ? <ClipboardCheck className="h-5 w-5 text-green-500" /> : <Clipboard className="h-5 w-5" />}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <Textarea 
                    readOnly 
                    value={transcription} 
                    className="min-h-[250px] bg-secondary border-secondary text-secondary-foreground"
                    placeholder="Transcription will appear here..." 
                />
            </div>
        )}
        
        {recordingState === 'error' && (
            <div className="flex flex-col items-center justify-center text-destructive p-8 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-10 w-10 mb-2" />
                <p className="font-semibold">Something went wrong.</p>
                <p className="text-sm">Please check your microphone permissions and try again.</p>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
