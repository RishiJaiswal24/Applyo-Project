import { connectDB } from "@/lib/mongoose";
import Poll from "@/models/Poll";

export async function GET(req, context) {

  try {

    await connectDB();

    const params=await context.params;

    const poll = await Poll.findOne({
      pollId: params.pollId
    }).lean();

    if (!poll) {
      return Response.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }
    console.log(poll);
    return Response.json(poll);

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}
