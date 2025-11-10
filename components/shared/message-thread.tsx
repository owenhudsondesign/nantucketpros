"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

interface MessageThreadProps {
  bookingId: string;
  otherPartyName?: string;
}

export function MessageThread({ bookingId, otherPartyName }: MessageThreadProps) {
  const { user } = useAuth();
  const { messages, loading, error, sendMessage } = useMessages(
    bookingId,
    user?.id || null
  );
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sand-600">Please log in to view messages.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>
          {otherPartyName
            ? `Chat with ${otherPartyName}`
            : "Chat about this booking"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages List */}
        <div className="h-96 overflow-y-auto space-y-3 p-4 bg-sand-50 rounded-md">
          {loading ? (
            <p className="text-center text-sand-600">Loading messages...</p>
          ) : error ? (
            <p className="text-center text-red-600">Failed to load messages</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sand-500">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === user.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isOwn
                        ? "bg-ocean-600 text-white"
                        : "bg-white border border-sand-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? "text-ocean-100" : "text-sand-500"
                      }`}
                    >
                      {formatRelativeTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="space-y-3">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            rows={3}
            disabled={sending}
            onKeyDown={(e) => {
              // Send on Ctrl+Enter or Cmd+Enter
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-sand-500">Press Ctrl+Enter to send</p>
            <Button type="submit" disabled={!newMessage.trim() || sending}>
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
