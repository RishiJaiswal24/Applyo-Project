import { connectDB } from "@/lib/mongoose";
import Poll from "@/models/Poll";
import { ably } from "@/lib/ably";

export async function POST(req) {

  try {

    await connectDB();

    const { pollId, optionId, deviceId } = await req.json();

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const poll = await Poll.findOne({ pollId });

    if (!poll) {
      return Response.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    // anti-abuse check
    const alreadyVoted = poll.voters.some(
      voter =>
        voter.deviceId === deviceId ||
        voter.ip === ip
    );

    if (alreadyVoted) {
      return Response.json(
        { error: "You already voted" },
        { status: 403 }
      );
    }

    // increment vote
    await Poll.updateOne(
      {
        pollId,
        "options.id": optionId
      },
      {
        $inc: { "options.$.votes": 1 },
        $push: {
          voters: { deviceId, ip }
        }
      }
    );

    const updatedPoll = await Poll.findOne({ pollId }).lean();

    // realtime update
    const channel = ably.channels.get(`poll-${pollId}`);
    await channel.publish("vote-update", updatedPoll);

    return Response.json({ success: true });

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}
