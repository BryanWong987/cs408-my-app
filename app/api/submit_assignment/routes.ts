export async function POST(request: Request) {
  const canvasUrl = process.env.CANVAS_BASE_URL;
  const token = process.env.CANVAS_API_TOKEN;

  const body = await request.json();

  const {
    courseId,
    assignmentId,
    submissionType,
    text,
    url,
  } = body;

  if (!courseId || !assignmentId || !text) {
    return Response.json(
      { error: "Course ID, assignment ID, and text are required." },
      { status: 400 }
    );
  }
  let submission;

if (submissionType === "online_text_entry") {
  submission = {
    submission_type: "online_text_entry",
    body: text,
  };
} else if (submissionType === "online_url") {
  submission = {
    submission_type: "online_url",
    url: url,
  };
} else {
  return Response.json(
    { error: "Unsupported submission type." },
    { status: 400 }
  );
}


  const response = await fetch(
    `${canvasUrl}/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions`,
    {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            submission,
        }),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    return Response.json(
      {
        error: "Canvas rejected the submission.",
        details: error,
      },
      { status: response.status }
    );
  }

  return Response.json(await response.json());
}