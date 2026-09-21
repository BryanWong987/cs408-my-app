import { getAssignment } from "@/app/lib/canvas";
import SubmissionForm from "./submission-form";

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{
    courseId: string;
    assignmentId: string;
  }>;
}) {
  const { courseId, assignmentId } = await params;

  const assignment = await getAssignment(
    Number(courseId),
    Number(assignmentId)
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">
          {assignment.name}
        </h1>

        <div className="mt-4 text-gray-600">
          <p>
            <strong>Due:</strong>{" "}
            {assignment.due_at
              ? new Date(assignment.due_at).toLocaleString()
              : "No due date"}
          </p>

          <p>
            <strong>Points:</strong>{" "}
            {assignment.points_possible ?? "N/A"}
          </p>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Instructions
          </h2>

          <div
            className="prose mt-3 max-w-none"
            dangerouslySetInnerHTML={{
              __html: assignment.description ?? "No instructions.",
            }}
          />
        </div>

        <SubmissionForm
          courseId={Number(courseId)}
          assignmentId={Number(assignmentId)}
          submissionTypes={assignment.submission_types}
        />
      </div>
    </main>
  );
}
