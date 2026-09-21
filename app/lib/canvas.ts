const canvasUrl = process.env.CANVAS_BASE_URL!;
const token = process.env.CANVAS_API_TOKEN!;

const headers = {
  Authorization: `Bearer ${token}`,
};

export async function getEnrollments() {
  return fetchAllPages(
    `${canvasUrl}/api/v1/users/self/enrollments`,
    headers
  );
}

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

// export default async function Home() {
//   const canvasUrl = process.env.CANVAS_BASE_URL;
//   const token = process.env.CANVAS_API_TOKEN;

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   // Get the user's enrollments and grades
//   const enrollmentsResponse = await fetch(
//     `${canvasUrl}/api/v1/users/self/enrollments`,
//     {
//       headers,
//     }
//   );

//   if (!enrollmentsResponse.ok) {
//     throw new Error("Failed to fetch enrollments from Canvas");
//   }

//   const enrollments = await enrollmentsResponse.json();

//   // Get the courses
//   const coursesResponse = await fetch(
//     `${canvasUrl}/api/v1/courses`,
//     {
//       headers,
//     }
//   );

//   if (!coursesResponse.ok) {
//     throw new Error("Failed to fetch courses from Canvas");
//   }

//   const courses = await coursesResponse.json();


// }