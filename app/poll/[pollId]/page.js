"use client";

import { useEffect, useState } from "react";
import Ably from "ably";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PollPage() {

  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);

  useEffect(() => {

    fetch(`/api/poll/${pollId}`)
      .then(res => res.json())
      .then(setPoll);

    const ably = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY
    });

    const channel = ably.channels.get(`poll-${pollId}`);

    channel.subscribe("vote-update", (msg) => {
      setPoll(msg.data);
    });

  }, []);

  function getDeviceId() {

    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
  }

  const vote = async (optionId) => {

    const deviceId = getDeviceId();

    await fetch("/api/poll/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pollId,
        optionId,
        deviceId
      })
    });

  };


  if (!poll) return <div>Loading...</div>;

  return (
    <>
      <div>
        <div className="flex bg-blue-100 p-10 mx-auto w-[50vw] border rounded-2xl items-center justify-center my-[20vh] min-h-[50vh]">
          <div className="w-full">

            <h1 className="text-center text-3xl font-medium">Answer the Poll</h1>

            <div className="h-5"></div>
            <h3 className="font-medium">Question:</h3>
            <p>{poll.question}</p>

            <h3 className="font-medium">Select Option:</h3>

            {poll.options.map(option => (
              <div key={option.id}>
                <div className="h-3"></div>
                <div className="cursor-pointer w-full flex justify-between bg-blue-300 px-2 rounded-3xl" onClick={() => vote(option.id)}>

                  {option.text}
                  <span> Votes: {option.votes}</span>
                </div>


              </div>
            ))}



          </div>
        </div>

      </div>
    </>
  );

}
