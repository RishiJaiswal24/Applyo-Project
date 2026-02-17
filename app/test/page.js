"use client";

import { useEffect, useState } from "react";
import Ably from "ably";

export default function TestPage() {

  const [messages, setMessages] = useState([]);
  const [ablyClient, setAblyClient] = useState(null);

  useEffect(() => {

    const client = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY
    });

    setAblyClient(client);

    const channel = client.channels.get("test-channel");

    channel.subscribe("vote-update", (msg) => {
      console.log("Received:", msg.data);

      setMessages(prev => [...prev, msg.data.text]);
    });

    return () => {
      client.close();
    };

  }, []);

  const sendMessage = async () => {

    const channel = ablyClient.channels.get("test-channel");

    await channel.publish("vote-update", {
      text: "Realtime works at " + new Date().toLocaleTimeString()
    });

  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>Ably Realtime Test</h1>

      <button onClick={sendMessage}>
        Send Test Message
      </button>

      <h2>Messages:</h2>

      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}

    </div>
  );
}
