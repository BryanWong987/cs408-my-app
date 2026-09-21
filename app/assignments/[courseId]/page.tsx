import { getAssignments } from "@/app/lib/canvas";
import SubmissionForm from "./[assignmentId]/submission-form";
import Link from "next/link";


export default async function AssignmentsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const assignments = await getAssignments(Number(courseId));

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Assignments
        </h1>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Assignment
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Submitted?
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Submit (text or URL submission only)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {assignments.map((assignment: any) => (
                <tr
                  key={assignment.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {assignment.name}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {assignment.due_at
                      ? new Date(assignment.due_at).toLocaleString()
                      : "No due date"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {assignment.points_possible ?? "N/A"}
                  </td>
                  
                  <td className="px-6 py-4 text-gray-700">
                    {assignment.has_submitted_submissions ? "Yes" : "No"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {assignment.has_submitted_submissions ? "Yes" : "No"}
                  </td>

                  <td className="px-6 py-4">
                    {(assignment.submission_types?.includes("online_text_entry") ||
                      assignment.submission_types?.includes("online_url")) && (
                        <Link
                          href={`/assignments/${courseId}/${assignment.id}`}
                          className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                        >
                          Submit
                        </Link>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
