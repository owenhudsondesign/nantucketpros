"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export function useMessages(bookingId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!bookingId || !userId) {
      setLoading(false);
      return;
    }

    fetchMessages();
    subscribeToMessages();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [bookingId, userId]);

  const fetchMessages = async () => {
    if (!bookingId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      const messagesData = data as any;
      setMessages(messagesData || []);

      // Mark messages as read if they're not from the current user
      const unreadMessages = (messagesData || []).filter(
        (msg: any) => !msg.read && msg.sender_id !== userId
      );

      if (unreadMessages.length > 0) {
        await markMessagesAsRead(unreadMessages.map((m: any) => m.id));
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!bookingId) return;

    const newChannel = supabase
      .channel(`messages:${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((current) => [...current, newMessage]);

          // Mark as read if not from current user
          if (newMessage.sender_id !== userId && !newMessage.read) {
            markMessagesAsRead([newMessage.id]);
          }
        }
      )
      .subscribe();

    setChannel(newChannel);
  };

  const markMessagesAsRead = async (messageIds: string[]) => {
    try {
      const query = supabase.from('messages');
      await query
        // @ts-expect-error - Supabase type inference issue with update
        .update({ read: true })
        .in('id', messageIds);

      // Update local state
      setMessages((current) =>
        current.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, read: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const sendMessage = async (content: string) => {
    if (!bookingId || !userId || !content.trim()) {
      return;
    }

    // Optimistic UI update - immediately add message to local state
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      booking_id: bookingId,
      sender_id: userId,
      content: content.trim(),
      read: false,
      created_at: new Date().toISOString(),
    };

    const previousMessages = [...messages];
    setMessages((current) => [...current, optimisticMessage]);

    try {
      const query = supabase.from('messages');
      // @ts-expect-error - Supabase type inference issue with insert
      const { error } = await query.insert({
        booking_id: bookingId,
        sender_id: userId,
        content: content.trim(),
        read: false,
      });

      if (error) {
        // Rollback on failure
        setMessages(previousMessages);
        throw error;
      }

      // Real message will replace optimistic one via realtime subscription
    } catch (err: any) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}
