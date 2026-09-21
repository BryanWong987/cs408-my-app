const canvasUrl = process.env.CANVAS_BASE_URL!;
const token = process.env.CANVAS_API_TOKEN!;

const headers = {
  Authorization: `Bearer ${token}`,
};

// Get all the courses the student is currently enrolled in (and grades)
export async function getEnrollments() {
  return fetchAllPages(
    `${canvasUrl}/api/v1/users/self/enrollments`,
    headers
  );
}

// Get all the courses the student is currently enrolled in
// Important for getting course name, which getEnrollments does not have (only the course id)
export async function getCourses() {
  return fetchAllPages(
    `${canvasUrl}/api/v1/courses`,
    headers
  );
}

export async function getAssignments(courseId: number) {
  return fetchAllPages(
    `${canvasUrl}/api/v1/courses/${courseId}/assignments`,
    headers
  );
}

export async function getAssignment(courseId: number, assignmentId : number) {
    const response = await fetch(
        `${canvasUrl}/api/v1/courses/${courseId}/assignments/${assignmentId}`,
        {
        headers,
        }
    );

    if (!response.ok) {
        throw new Error(
        `Failed to fetch assignment: ${response.status}`
        );
    }

    return response.json();
}

async function fetchAllPages(
  url: string,
  headers: HeadersInit
) {
  const results: any[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Canvas API error: ${response.status}`);
    }

    const data = await response.json();

    results.push(...data);

    const linkHeader = response.headers.get("Link");

    nextUrl = getNextUrl(linkHeader);
  }

  return results;
}

function getNextUrl(linkHeader: string | null): string | null {
  if (!linkHeader) {
    return null;
  }

  const nextLink = linkHeader
    .split(",")
    .find((link) => link.includes('rel="next"'));

  if (!nextLink) {
    return null;
  }

  const match = nextLink.match(/<([^>]+)>/);

  return match ? match[1] : null;
}