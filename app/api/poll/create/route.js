import { connectDB } from "@/lib/mongoose";
import Poll from "@/models/Poll";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    await connectDB();
    const { question, options } = await req.json();
    if (!question || question.trim().length < 10 || !options || options.length < 1 || options.some(opt => opt.trim().length === 0)) {
      return Response.json(
        { error: "Invalid poll data" },
        { status: 400 }
      );
    }
    const pollId = uuidv4();

    const pollOptions = options.map(text => ({
      id: uuidv4(),
      text: text.trim(),
      votes: 0
    }));

    const poll = await Poll.create({
      pollId,
      question: question.trim(),
      options: pollOptions,
      voters: [] // for anti-abuse later
    });

    return Response.json({
      success: true,
      pollId: poll.pollId,
      shareLink: `/poll/${poll.pollId}`
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

