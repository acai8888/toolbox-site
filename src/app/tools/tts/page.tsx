"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  Mic,
  Download,
  AlertCircle,
  Info,
  Check,
  Loader2,
} from "lucide-react";

type SpeechStatus = "idle" | "playing" | "paused";

interface VoiceOption {
  voice: SpeechSynthesisVoice;
  label: string;
  langLabel: string;
  isChinese: boolean;
}

export default function TTSPage() {
  const [text, setText] = useState(
    "欢迎使用文字转语音工具。输入文本，选择语音，点击播放即可听到朗读效果。"
  );
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>("");
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [recordError, setRecordError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Load voices
  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const allVoices = window.speechSynthesis.getVoices();
    if (allVoices.length === 0) return;

    const mapped: VoiceOption[] = allVoices.map((v) => {
      const lang = v.lang.toLowerCase();
      const isChinese =
        lang.startsWith("zh-") || lang === "zh" || lang.startsWith("cmn");
      let langLabel = v.lang;
      if (lang.startsWith("zh-cn") || lang === "zh" || lang.startsWith("cmn")) {
        langLabel = "中文（简体）";
      } else if (lang.startsWith("zh-tw")) {
        langLabel = "中文（台湾）";
      } else if (lang.startsWith("zh-hk")) {
        langLabel = "中文（香港）";
      } else if (lang.startsWith("en")) {
        langLabel = "English";
      } else if (lang.startsWith("ja")) {
        langLabel = "日本語";
      } else if (lang.startsWith("ko")) {
        langLabel = "한국어";
      } else if (lang.startsWith("fr")) {
        langLabel = "Français";
      } else if (lang.startsWith("de")) {
        langLabel = "Deutsch";
      } else if (lang.startsWith("es")) {
        langLabel = "Español";
      } else if (lang.startsWith("ru")) {
        langLabel = "Русский";
      }

      return {
        voice: v,
        label: v.name,
        langLabel,
        isChinese,
      };
    });

    // Sort: Chinese first, then others
    mapped.sort((a, b) => {
      if (a.isChinese && !b.isChinese) return -1;
      if (!a.isChinese && b.isChinese) return 1;
      return a.label.localeCompare(b.label);
    });

    setVoices(mapped);
    setIsLoadingVoices(false);

    // Auto-select first Chinese voice or first voice
    if (mapped.length > 0 && !selectedVoiceUri) {
      const chineseVoice = mapped.find((v) => v.isChinese);
      setSelectedVoiceUri(chineseVoice?.voice.voiceURI || mapped[0].voice.voiceURI);
    }
  }, [selectedVoiceUri]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    loadVoices();

    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
      stopSpeech();
      cleanupRecording();
    };
  }, [loadVoices]);

  const selectedVoice = voices.find((v) => v.voice.voiceURI === selectedVoiceUri)?.voice;

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");
    utteranceRef.current = null;
  }, []);

  const cleanupRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setIsRecording(false);
  }, []);

  const handlePlay = useCallback(() => {
    if (!text.trim()) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // If paused, resume
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }

    // If playing, do nothing
    if (status === "playing") return;

    // Start new speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => setStatus("playing");
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    utterance.onpause = () => setStatus("paused");
    utterance.onresume = () => setStatus("playing");

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, selectedVoice, rate, pitch, volume, status]);

  const handlePause = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setStatus("paused");
    }
  }, []);

  const handleStop = useCallback(() => {
    stopSpeech();
  }, [stopSpeech]);

  const handleRecord = useCallback(async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      setIsRecording(false);
      return;
    }

    if (!text.trim()) return;

    setRecordError("");
    setDownloadReady(false);
    setAudioUrl(null);
    audioChunksRef.current = [];

    try {
      // Capture system audio + microphone (browser may limit this)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;

      // Also try to get user audio to mix
      let mixedStream = stream;
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new AudioContext();
        const dest = audioCtx.createMediaStreamDestination();

        const sysSource = audioCtx.createMediaStreamSource(stream);
        const micSource = audioCtx.createMediaStreamSource(micStream);

        sysSource.connect(dest);
        micSource.connect(dest);

        mixedStream = dest.stream;
      } catch {
        // Fallback to display media stream only
      }

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/ogg";

      const recorder = new MediaRecorder(mixedStream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setDownloadReady(true);
        setIsRecording(false);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };

      recorder.start(100);
      setIsRecording(true);

      // Start speech after a short delay to ensure recording is active
      setTimeout(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();

          const utterance = new SpeechSynthesisUtterance(text);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
          utterance.rate = rate;
          utterance.pitch = pitch;
          utterance.volume = volume;

          utterance.onend = () => {
            setTimeout(() => {
              if (recorder.state !== "inactive") {
                recorder.stop();
              }
            }, 500);
          };

          utterance.onerror = () => {
            if (recorder.state !== "inactive") {
              recorder.stop();
            }
          };

          window.speechSynthesis.speak(utterance);
        }
      }, 300);
    } catch (err) {
      setRecordError("无法启动录制，浏览器可能不支持此功能。请使用播放功能。");
      setIsRecording(false);
    }
  }, [isRecording, text, selectedVoice, rate, pitch, volume]);

  const handleDownload = useCallback(() => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `tts-recording-${Date.now()}.webm`;
    a.click();
  }, [audioUrl]);

  const formatSliderValue = (value: number) => {
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(1);
  };

  const isSpeechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">文字转语音</h1>
      <p className="text-muted mb-8">使用浏览器原生语音合成 API，将文本转换为语音</p>

      {!isSpeechSupported && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>您的浏览器不支持 Web Speech API，请使用 Chrome、Edge 或 Safari 浏览器。</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Text Input + Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">输入文本</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入要转换的文本..."
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {status === "playing" ? (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium"
              >
                <Pause className="w-4 h-4" />
                暂停
              </button>
            ) : (
              <button
                onClick={handlePlay}
                disabled={!text.trim() || !isSpeechSupported}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "paused" ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {status === "paused" ? "继续" : "播放"}
              </button>
            )}

            <button
              onClick={handleStop}
              disabled={status === "idle"}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border hover:bg-card-hover text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Square className="w-4 h-4" />
              停止
            </button>

            <div className="w-px h-6 bg-border mx-1" />

            <button
              onClick={handleRecord}
              disabled={!text.trim() || !isSpeechSupported}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isRecording
                  ? "bg-danger text-white hover:bg-danger/90"
                  : "bg-card border border-border hover:bg-card-hover"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4" />
                  停止录制
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  录制
                </>
              )}
            </button>

            {downloadReady && audioUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-success text-white hover:bg-success/90 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                下载音频
              </button>
            )}
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 text-sm text-danger">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-danger" />
              </span>
              正在录制语音输出，朗读结束后会自动停止...
            </div>
          )}

          {recordError && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {recordError}
            </div>
          )}

          {downloadReady && audioUrl && (
            <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              录制完成！点击"下载音频"按钮保存文件。
            </div>
          )}
        </div>

        {/* Right: Voice Settings */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 space-y-5">
            <h3 className="font-semibold text-sm">语音设置</h3>

            {/* Voice Select */}
            <div>
              <label className="block text-sm font-medium mb-2">选择语音</label>
              {isLoadingVoices ? (
                <div className="flex items-center gap-2 text-sm text-muted py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  加载语音列表...
                </div>
              ) : (
                <select
                  value={selectedVoiceUri}
                  onChange={(e) => setSelectedVoiceUri(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  {voices.length === 0 && (
                    <option value="">暂无可用语音</option>
                  )}
                  {voices.map((v) => (
                    <option key={v.voice.voiceURI} value={v.voice.voiceURI}>
                      {v.label} ({v.langLabel})
                    </option>
                  ))}
                </select>
              )}
              {voices.length > 0 && (
                <p className="text-xs text-muted mt-1.5">
                  共 {voices.length} 个语音，已优先显示中文语音
                </p>
              )}
            </div>

            {/* Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">语速</label>
                <span className="text-xs text-muted">{formatSliderValue(rate)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted mt-1">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Pitch */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">音调</label>
                <span className="text-xs text-muted">{formatSliderValue(pitch)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted mt-1">
                <span>低</span>
                <span>默认</span>
                <span>高</span>
              </div>
            </div>

            {/* Volume */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">音量</label>
                <span className="text-xs text-muted">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Quick Test */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3">快速测试</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "你好，世界",
                "今天天气真不错",
                "Hello, world",
                "这是一段测试文本",
              ].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setText(sample)}
                  className="px-3 py-1.5 rounded-lg bg-background border border-border hover:bg-card-hover text-xs"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Usage Info */}
      <div className="mt-10 p-5 rounded-xl bg-card border border-border">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-muted">
            <p className="font-medium text-foreground">使用说明</p>
            <ul className="list-disc list-inside space-y-1">
              <li>本工具使用浏览器原生 Web Speech API，无需联网即可使用。</li>
              <li>语音列表由您的操作系统和浏览器提供，不同设备可用的语音可能不同。</li>
              <li>如果语音列表为空，请尝试刷新页面或更换浏览器（推荐 Chrome、Edge）。</li>
              <li>录制功能通过屏幕音频捕获实现，部分浏览器可能不支持下载，可直接使用播放功能。</li>
              <li>长时间朗读时，某些浏览器可能会自动暂停，点击"继续"即可恢复。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
