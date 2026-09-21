"use client";

import { useState, type FormEvent } from "react";

type SubmissionFormProps = {
  courseId: number;
  assignmentId: number;
  submissionTypes: string[];
};

export default function SubmissionForm({
  courseId,
  assignmentId,
  submissionTypes,
}: SubmissionFormProps) {
  const supportsText = submissionTypes.includes("online_text_entry");
  const supportsUrl = submissionTypes.includes("online_url");

  const [submissionType, setSubmissionType] = useState<
    "online_text_entry" | "online_url"
  >(supportsText ? "online_text_entry" : "online_url");

  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const value =
      submissionType === "online_text_entry" ? text.trim() : url.trim();

    if (!value) {
      setMessage("Please enter a submission before submitting.");
      return;
    }

    if (submissionType === "online_url") {
      try {
        new URL(value);
      } catch {
        setMessage("Please enter a valid URL.");
        return;
      }
    }

    const confirmed = window.confirm(
      "Are you sure you want to submit this assignment?"
    );

    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/submit-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          assignmentId,
          submissionType,
          text: submissionType === "online_text_entry" ? text : undefined,
          url: submissionType === "online_url" ? url : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Submission failed.");
        return;
      }

      setMessage("Assignment submitted successfully!");
      setText("");
      setUrl("");
    } catch {
      setMessage("Something went wrong while submitting.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Submit Assignment
      </h2>

      {/* Submission type selection */}
      {supportsText && supportsUrl && (
        <div className="mt-4">
          <p className="mb-2 font-medium text-gray-900">
            Submission type
          </p>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="submissionType"
                value="online_text_entry"
                checked={submissionType === "online_text_entry"}
                onChange={() => setSubmissionType("online_text_entry")}
                disabled={submitting}
              />
              Text
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="submissionType"
                value="online_url"
                checked={submissionType === "online_url"}
                onChange={() => setSubmissionType("online_url")}
                disabled={submitting}
              />
              URL
            </label>
          </div>
        </div>
      )}

      {/* Text submission */}
      {submissionType === "online_text_entry" && supportsText && (
        <div className="mt-4">
          <label
            htmlFor="submission"
            className="mb-2 block font-medium text-gray-900"
          >
            Your response
          </label>

          <textarea
            id="submission"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type your response here..."
            rows={12}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 p-4 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />

          <p className="mt-2 text-sm text-gray-500">
            {text.length} characters
          </p>
        </div>
      )}

      {/* URL submission */}
      {submissionType === "online_url" && supportsUrl && (
        <div className="mt-4">
          <label
            htmlFor="url"
            className="mb-2 block font-medium text-gray-900"
          >
            URL
          </label>

          <input
            id="url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/your-submission"
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={
          submitting ||
          (submissionType === "online_text_entry"
            ? !text.trim()
            : !url.trim())
        }
        className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {submitting ? "Submitting..." : "Submit Assignment"}
      </button>

      {message && (
        <p className="mt-4 rounded-lg bg-gray-100 p-4 font-medium text-gray-700">
          {message}
        </p>
      )}
    </form>
  );
}
