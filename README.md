# Canvas Assignment Tracker

A small Node.js web app that logs into the Canvas LMS REST API with your personal
access token, and lists the courses you are enrolled in and their grades. You can
click on each course to view the assignments for that course, and also submit
an assignment if it supports text entry or URL.
---

## Setup Instructions

These steps assume you have never used `npm` before. `npm` is the package manager
that ships with Node.js (and therefore Next.js); it reads `package.json` and downloads the libraries the
project depends on into a local `node_modules/` folder.

### 1. Install Node.js

This application was developed with Node version v24.14.1. Check your node version with the command:

```bash
node --version
```

If the command is not found,
install Node from [nodejs.org](https://nodejs.org/)


### 2. Clone the repository

```bash
git clone https://github.com/<your-username>/full-stack-rest.git
cd full-stack-rest
```

### 3. Install the dependencies
Run the following command in the project directory:
```bash
npm install
```

This creates `node_modules/`. You only need to run it once (and again whenever
`package.json` changes). `node_modules/` is git-ignored, so never commit it.

### 4. Create your `.env` file

Copy the .env template and open it in your editor:

```bash
cp .env.example .env
```

Then paste in the token you generated in Canvas
(**Account → Settings → Approved Integrations → + New Access Token**):

```
CANVAS_API_TOKEN=13~yourReallyLongTokenGoesHere
CANVAS_BASE_URL=https://boisestatecanvas.instructure.com
PORT=3000
```

> **Your token is a password.** It grants full access to your Canvas account.
> `.env` is listed in [`.gitignore`](.gitignore) so git will not track it. If you
> ever push a token by accident, delete it in Canvas *immediately* and generate a
> new one. Rewriting git history is not enough, because the old value is already
> in someone's clone.

### 5. Run it

```bash
npm run dev
```

Then open <http://localhost:3000>. Stop the server with `Ctrl+C` in the terminal.

During development, `npm run dev` restarts the server automatically whenever you
save a file.
---

## Usage

1. Open <http://localhost:3000>. Your courses are listed
on the page.
2. You can click on a course name to view assignments for that course.
3. For assignments that support text box submission or URL submission, a Submit button will appear taking you to a submission form.
4. Use the submission form for that assignment to submit!

## API Endpoints Used

| Method | Endpoint | What we use it for |
| --- | --- | --- |
| `GET` | `/api/v1/users/self/enrollments` | Gets the courses the student is enrolled in, grades for each course, and course id. |
| `GET` | `/api/v1/courses` | Gets the courses for the student (similar to previous endpoint), BUT also gets the course name in addition to course id. This allows us to map course name to course id. |
| `GET` | `/api/v1/courses/${courseId}/assignments` | Gets the assignments for a course, through the course id. |
| `GET` | `/api/v1/courses/${courseId}/assignments/${assignmentId}` | Gets the details about an assignment (using course id and assignment id). Useful for retrieving information like assignment description and title. |
| `POST` | `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions` | Uses the course id and assignment id to submit an assignment (this application currently only supports text box or URL submissions)


All endpoints are called with an `Authorization: Bearer <token>` header. See
[`app/lib/canvas.ts`](app/lib/canvas.ts).

### Pagination

GET requests for getting courses, enrollments, and assignments are paginated by Canvas. The function
`fetchAllPages()` in [`app/lib/canvas.ts`](app/lib/canvas.ts) gets the data returned by the endpoint, and also
gets the link header to retrieve the next set of data until there is no data left (i.e. there is no 'rel="next"').


## Reflection
This was a very fun lab! This was my first assignment where I basically vibe coded the whole application since I am allowed to use AI, which came with its pros and cons. I used ChatGPT, and I was shocked at how accurate and error-free the code was, while also clearly explaining to me important concepts like pagination, parsing JSON, and writing routes with the Next.js framework. 

I ran into problems with retrieving the course name. Originally, I wanted to list the courses and their grades, which led me to use the "/api/v1/courses/:id/enrollments" endpoint. However, the JSON returned from this endpoint does not give a course name, only the course id. This meant I needed another endpoint (/api/v1/courses) to get my courses (both course name and id) which I can then map course ids to course names.  Also, when using AI to write the text/URL submission code, the code quickly became nontrivial since I realized there were many submission types. I started with a text box submission, but I wanted to add a URL submission since this assignment is submitted using a URL. Asking ChatGPT to do this led to adding another directory + page file for handling submissions, and modifying multiple files to support multiple submission types.

I would improve this application by reviewing all code to add comments on non-trivial code, making error messages more descriptive, and adding assignment submission support for all submission types (e.g. file upload). I would also research if I can use fewer endpoints in my code for listing courses and grades, and change the assignments table to display the score received for each assignment.

I was in a rush to complete this assignment in one day, since unfortunately I am a huge procrastinator. Looking back, I would have started this assignment earlier and would have used AI for assistance, but not to the extent of doing the assignment for me. I would have improved my learning through looking at Next.js and React docs, and dealing with issues in code when writing code on my own.
