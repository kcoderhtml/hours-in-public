import type { APIRoute } from "astro";

import { getSession, type Session } from "../../utils/auth/auth";

import { AirtableTs } from "airtable-ts";
import { ProjectDockTable } from "./airtableTypes";

const db = new AirtableTs({ apiKey: process.env.AIRTABLE_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  let session: Session | null = null;
  const sessionCookie = request.headers
    .get("Cookie")
    ?.match(/session=([^;]+)/)?.[1];
  if (sessionCookie !== undefined) {
    session = getSession(sessionCookie);
  }
  // get the posted data
  const data: {
    submittedProjects: {
      repo: string;
      invalid: boolean;
      projects: { name: string; time: string; seconds: number }[];
    }[];
    hackatimeUser: string;
    allergies: string;
    comments: string;
    fudge: string;
  } = await request.json();

  if (!data) {
    return new Response("Bad Request", { status: 400 });
  } else if (data.submittedProjects.length === 0) {
    return new Response("No data provided", { status: 400 });
  } else {
    for (const { repo, invalid, projects } of data.submittedProjects) {
      for (const { name, time, seconds } of projects) {
        await db.insert(ProjectDockTable, {
          name: session?.profile.fullname,
          slackID: session?.profile.id,
          repoLink: repo,
          projectHackatimeId: name,
          projectHoursReadable: time,
          projectSeconds: seconds,
          hackatimeUserid: data.hackatimeUser,
          allergies: data.allergies,
          comments: data.comments,
          fudgeType: data.fudge,
          invalid,
        });
      }
    }
    return new Response("Success", { status: 200 });
  }
};
