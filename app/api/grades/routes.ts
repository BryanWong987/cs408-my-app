// app/api/courses/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const canvasUrl = process.env.CANVAS_BASE_URL!;
  const token = process.env.CANVAS_API_TOKEN!;

  const response = await fetch(
    `${canvasUrl}/api/v1/users/self/enrollments?include[]=course`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    return Response.json(
      { error: "Canvas API request failed" },
      { status: response.status }
    );
  }

  const enrollments = await response.json();

  // Transforms object into json with necessary fields
  const grades = enrollments.map((enrollment: any) => ({
    courseId: enrollment.course_id,
    courseName: enrollment.course?.name,
    currentGrade: enrollment.grades?.current_grade,
    currentScore: enrollment.grades?.current_score,
    finalGrade: enrollment.grades?.final_grade,
    finalScore: enrollment.grades?.final_score,
  }));

  return NextResponse.json(grades);
}

