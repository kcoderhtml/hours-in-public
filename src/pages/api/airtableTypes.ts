/* DO NOT EDIT: this file was automatically generated by airtable-ts-codegen */
/* eslint-disable */
import type { Item, Table } from "airtable-ts";

export interface ProjectDock extends Item {
  id: string;
  name: string;
  slackID: string;
  repoLink: string;
  projectHackatimeId: string;
  projectHoursReadable: string;
  projectSeconds: number;
  hackatimeUserid: string;
  allergies: string;
  fudgeType: string;
  comments: string;
}

export const ProjectDockTable: Table<ProjectDock> = {
  name: "Project Dock",
  baseId: "appUpK8vBRXvkdFai",
  tableId: "tblY3Tp99L3XKDokW",
  mappings: {
    name: "fldfBGUwetXFGtAum",
    slackID: "fld0kv7ajtpvefHKc",
    repoLink: "fldwHQYbLLp8mWCN3",
    projectHackatimeId: "fldaw8gMBtCkbVrcK",
    projectHoursReadable: "fldo9xlH5TKHxKiAm",
    projectSeconds: "fld3MGx10u5eRxrhr",
    hackatimeUserid: "fld9BMhrAbSOoV23B",
    allergies: "fldaMtZs0MxieZy9h",
    fudgeType: "fldhKArjlI4844uRH",
    comments: "fldL1jCjdoRvwmpAs",
  },
  schema: {
    name: "string",
    slackID: "string",
    repoLink: "string",
    projectHackatimeId: "string",
    projectHoursReadable: "string",
    projectSeconds: "number",
    hackatimeUserid: "string",
    allergies: "string",
    fudgeType: "string",
    comments: "string",
  },
};
