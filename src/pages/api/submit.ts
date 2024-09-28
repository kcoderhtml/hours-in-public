import type { APIRoute } from "astro";

import { getSession, type Session } from "../../utils/auth/auth";

import { AirtableTs } from "airtable-ts";
import type { Item, Table } from "airtable-ts";

export interface PrizeMap extends Item {
  id: string;
  name: string;
  slackID: string;
  repoLink: string;
  projectsId: string;
  projectHours: string;
  hackatimeUserid: string;
}

export const TablePrizeMap: Table<PrizeMap> = {
  name: "Prize Map",
  baseId: "appUpK8vBRXvkdFai",
  tableId: "tblY3Tp99L3XKDokW",
  mappings: {
    name: "fldfBGUwetXFGtAum",
    slackID: "fld0kv7ajtpvefHKc",
    repoLink: "fldwHQYbLLp8mWCN3",
    projectsId: "fldaw8gMBtCkbVrcK",
    projectHours: "fldo9xlH5TKHxKiAm",
    hackatimeUserid: "fld9BMhrAbSOoV23B",
  },
  schema: {
    name: "string",
    slackID: "string",
    repoLink: "string",
    projectsId: "string",
    projectHours: "string",
    hackatimeUserid: "string",
  },
};

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
      projects: { name: string; time: string }[];
    }[];
    hackatimeUser: string;
  } = await request.json();

  if (!data) {
    return new Response("Bad Request", { status: 400 });
  } else if (data.submittedProjects.length === 0) {
    return new Response("No data provided", { status: 400 });
  } else {
    for (const { repo, projects } of data.submittedProjects) {
      for (const { name, time } of projects) {
        await db.insert(TablePrizeMap, {
          name: session?.profile.fullname,
          slackID: session?.profile.id,
          repoLink: repo,
          projectsId: name,
          projectHours: time,
          hackatimeUserid: data.hackatimeUser,
        });
      }
    }
    return new Response("Success", { status: 200 });
  }
};
