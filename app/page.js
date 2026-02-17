"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"

export default function Home() {
  const [question, setQuestion] = useState("");
  const [creating, setCreating] = useState(false)
  const [link, setlink] = useState("")
  const [options, setOptions] = useState(["", ""]);
  const router = useRouter();
  const [copied, setCopied] = useState(false)
  const isValidPoll =
    question.trim().length >= 10 &&
    options.length >= 2 &&
    options.every(opt => opt.trim().length > 0);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };


  

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

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
      setCreating(true)
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
      setlink(`${process.env.NEXT_PUBLIC_URL}poll/${data.pollId}`);
    } catch (error) {

      console.error(error);
      alert("Error creating poll");

    }finally{
      setCreating(false)
    }
  }

  return (
    <>

      <div className="flex bg-blue-100 p-10 mx-auto w-[50vw] border rounded-2xl items-center justify-center my-[20vh] min-h-[50vh]">
        <div className="w-full">

          <h1 className="text-center text-3xl font-medium">Create a Poll</h1>
          {link.length>10 && (<Card className="w-full">
            <CardContent className="flex items-center gap-2">
              <Input
                className="bg-blue-800 flex-1 cursor-pointer text-white"
                value={link}
                readOnly
                onClick={handleCopy}
              />

              {/* Copy Button */}
              <Button onClick={handleCopy} size="icon" variant="outline">
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>

            </CardContent>
          </Card>)}

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
              {creating ? "Creating...":"Create Poll"}
            </Button>
          </div>


        </div>
      </div>
    </>
  );
}
