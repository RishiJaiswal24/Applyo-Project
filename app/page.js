"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const router=useRouter();
  const isValidPoll =
    question.trim().length >= 10 &&
    options.length >= 2 &&
    options.every(opt => opt.trim().length > 0);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const deleteOption = () => {

    if (options.length <= 2) {
      alert("Poll must have at least 2 options");
      return;
    }

    const newOptions = options.slice(0, -1);
    setOptions(newOptions);

  };

  const handleCreate = async () => {
    if (!isValidPoll) {
      alert("Poll cannot be created ")
    }
    try {
      const res = await fetch("api/poll/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: question.trim(),
          options: options.map(opt => opt.trim())
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create poll");
      }
      router.push(`/poll/${data.pollId}`);
    } catch (error) {

      console.error(error);
      alert("Error creating poll");

    }
  }

  return (
    <>

      <div className="flex bg-blue-100 p-10 mx-auto w-[50vw] border rounded-2xl items-center justify-center my-[20vh] min-h-[50vh]">
        <div className="w-full">

          <h1 className="text-center text-3xl font-medium">Create a Poll</h1>

          <div className="h-5"></div>
          <h3>Question:</h3>
          <Input onChange={(e) => setQuestion(e.target.value)} value={question} placeholder="Enter Your Question" className="bg-white w-full" />

          <h3>Options:</h3>

          {options.map((opt, idx) => (
            <div key={idx}>
              <div className="h-2"></div>
              <Input placeholder={`Option ${idx + 1}`} value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="bg-white w-full" />
            </div>

          ))}

          <div className="h-5"></div>

          <div className="flex gap-2">
            <Button onClick={addOption}>Add Options</Button>
            <Button onClick={deleteOption} variant="destructive">Delete Option</Button>
          </div>


          <div className="h-5"></div>

          <div className="flex w-full justify-end">
            <Button
              onClick={handleCreate}
              disabled={!isValidPoll}
              className="justify-end"
            >
              Create Poll
            </Button>
          </div>


        </div>
      </div>
    </>
  );
}
