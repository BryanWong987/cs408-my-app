import { getCourses, getEnrollments } from "./lib/canvas";
import Link from "next/link";

export default async function Home() {
  const enrollments = await getEnrollments();
  const courses = await getCourses();

  // Create a Map so we can quickly find a course by ID
  const courseMap = new Map(
    courses.map((course: any) => [course.id, course.name])
  );

  // Combine the enrollment/grade information with the course names
  const grades = enrollments.map((enrollment: any) => ({
    courseId: enrollment.course_id,
    course: courseMap.get(enrollment.course_id) ?? "Unknown Course",
    score: enrollment.grades?.current_score,
    grade: enrollment.grades?.current_grade,
  }));

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          My Grades
        </h1>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Course (click to view assignments)
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Grade
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Percentage
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {grades.map((grade: any) => (
                <tr
                  key={grade.courseId}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">
                    <Link
                      href={`/assignments/${grade.courseId}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {grade.course}
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {grade.grade ?? "N/A"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {grade.score != null ? `${grade.score}%` : "N/A"}
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
