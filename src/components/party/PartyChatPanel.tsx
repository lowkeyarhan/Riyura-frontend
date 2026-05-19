"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { Link as LinkIcon, Smile } from "lucide-react";
import { ChatMessage, PartyParticipant } from "@/src/props/party/watchParty";
import { colorForId, fmtTime, initials } from "@/src/lib/utils/party";

interface PartyChatPanelProps {
  participants: PartyParticipant[];
  messages: ChatMessage[];
  currentUserId: string | undefined;
  partyId: string | null;
  isConnected: boolean;
  onSendChat: (content: string) => Promise<void>;
  onLeave: () => void;
}

export function PartyChatPanel({
  participants,
  messages,
  currentUserId,
  partyId,
  isConnected,
  onSendChat,
  onLeave,
}: PartyChatPanelProps) {
  const [chatInput, setChatInput] = useState("");
  const [copiedInvite, setCopiedInvite] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!chatInput.trim()) return;
    await onSendChat(chatInput.trim());
    setChatInput("");
  }, [chatInput, onSendChat]);

  const handleCopyInvite = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    console.log("[WATCH PARTY] Invite link copied →", url);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  }, []);

  return (
    <>
      {/* Invite card */}
      <div className="rounded-[32px] apple-glass p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <LinkIcon size={18} className="text-[#ff571e]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Invite Friends</h3>
            <p className="text-white/50 text-xs truncate max-w-[120px]">
              {partyId ? `Party: ${partyId}` : "Creating party…"}
            </p>
          </div>
        </div>
        <button
          onClick={handleCopyInvite}
          disabled={!partyId}
          className="bg-[#E8470A] text-white rounded-full px-4 py-2 text-sm font-medium shadow-[0_0_20px_rgba(232,71,10,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {copiedInvite ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-[2rem] apple-glass shadow-2xl">
        {/* Participants strip */}
        <div
          className="flex items-center justify-between px-2 py-3 m-2 rounded-[1.5rem] flex-shrink-0"
          style={{
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center pl-2" style={{ height: 40 }}>
            {participants.map((p, i) => (
              <div
                key={p.userId}
                title={p.username}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold ring-2 ring-black flex-shrink-0 overflow-hidden"
                style={{
                  backgroundColor: p.avatarUrl
                    ? undefined
                    : colorForId(p.userId),
                  marginLeft: i === 0 ? 0 : -10,
                  zIndex: participants.length - i,
                  position: "relative",
                }}
              >
                {p.avatarUrl ? (
                  <Image
                    src={p.avatarUrl}
                    alt={p.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  initials(p)
                )}
                {p.host && (
                  <span className="absolute -top-1 -right-1 text-[8px]">
                    👑
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? "bg-green-500" : "bg-yellow-400 animate-pulse"
              }`}
            />
            <span className="text-[12px] font-semibold text-gray-500">
              {participants.length} watching
            </span>
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
              >
                {!isMe && (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0 overflow-hidden"
                    style={{
                      backgroundColor: msg.avatarUrl
                        ? undefined
                        : colorForId(msg.senderId),
                    }}
                  >
                    {msg.avatarUrl ? (
                      <Image
                        src={msg.avatarUrl}
                        alt={msg.senderName}
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    ) : (
                      msg.senderName.charAt(0).toUpperCase()
                    )}
                  </div>
                )}
                <div
                  className={`flex flex-col max-w-[70%] min-w-0 ${isMe ? "items-end" : ""}`}
                >
                  <div
                    className={`flex items-baseline gap-2 mb-0.5 ${isMe ? "flex-row-reverse" : ""}`}
                  >
                    <span className="text-[13px] font-semibold text-white truncate max-w-[120px]">
                      {isMe ? "You" : msg.senderName}
                    </span>
                    <span className="text-[10px] text-white/30 flex-shrink-0">
                      {fmtTime(msg.sentAt)}
                    </span>
                  </div>
                  <p
                    className={`text-[13px] text-white/80 leading-snug break-words ${isMe ? "pl-2 text-right" : "pr-2"}`}
                  >
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="px-3 py-3 flex-shrink-0 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full pl-3 pr-2 py-3 flex-1 apple-glass">
            <Smile
              size={20}
              className="text-gray-400 flex-shrink-0 stroke-[1.5]"
            />
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Say something…"
              maxLength={500}
              className="flex-1 bg-transparent text-[13px] text-white/80 placeholder:text-gray-500 outline-none min-w-0"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!chatInput.trim() || !partyId}
            className="px-4 py-3 rounded-full apple-glass hover:bg-white/10 text-white text-[13px] font-medium flex-shrink-0 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>

      {/* Leave party button */}
      <button
        onClick={onLeave}
        className="apple-glass rounded-full py-3 text-red-400 text-[13px] font-semibold hover:bg-red-500/10 transition-all flex-shrink-0"
      >
        Leave Party
      </button>
    </>
  );
}
