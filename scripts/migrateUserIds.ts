import { Client, type QueryResult } from "pg";

const client = new Client(process.env.DATABASE_URL);

const users: { old: string; new: string }[] = [
  { old: "krn", new: "U062UG485EE" },
  { old: "Ssmidge", new: "U079A6KNYB1" },
  { old: "TheTridentGuy", new: "U06FG6G6SNL" },
  { old: "ajhalili2006", new: "U07CAPBB9B5" },
  { old: "arsoninstigator", new: "U07BBK4KHUK" },
  { old: "Bartosz", new: "U079VBNLTPD" },
  { old: "Cyao", new: "U07EQJY9YDD" },
  { old: "dld", new: "U07E6TW9DL0" },
  { old: "dillan", new: "U054VC2KM9P" },
  { old: "Evan-Gan", new: "U05D1G4H754" },
  { old: "felixgao", new: "U07BU2HS17Z" },
  { old: "bettatested", new: "U07EB2Y76DP" },
  { old: "kestrel", new: "U07346379NY" },
  { old: "skyfall", new: "U059VC0UDEU" },
  { old: "PonderSlime", new: "U07AD6RKUBW" },
  { old: "neon", new: "U07L45W79E1" },
  { old: "apringle", new: "U07960MD940" },
  { old: "stoopidity", new: "U07JJL30HPA" },
  { old: "saumil707", new: "U078K08NN2Y" },
  { old: "Luna5379", new: "U06M89VS2SD" },
  { old: "TheScientist101", new: "U04J9A6NUAW" },
];

function printProgress(text: string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(text);
}

async function updateUserId(
  oldUserId: string,
  newUserId: string,
  userNumber: number
) {
  const queries = [
    `
        UPDATE users
        SET id = '${newUserId}'
        WHERE id = '${oldUserId}';
        `,
    `
        UPDATE aliases
        SET user_id = '${newUserId}'
        WHERE user_id = '${oldUserId}';
        `,
    `
        UPDATE heartbeats
        SET user_id = ''
        WHERE user_id = '${oldUserId}';
        `,
    `
        UPDATE leaderboard_items
        SET user_id = '${newUserId}'
        WHERE user_id = '${oldUserId}';
        `,
    `
        UPDATE project_labels
        SET user_id = '${newUserId}'
        WHERE user_id = '${oldUserId}';
        `,
    `
        UPDATE summaries
        SET user_id = '${newUserId}'
        WHERE user_id = '${oldUserId}';
        `,
  ];

  try {
    let i = 0;
    for (const query of queries) {
      const result = await client.query(query);
      const table = query.match(/UPDATE (\w+)/)![1];
      printProgress(
        `Query ${i}/6/${userNumber}/${users.length}: Updated ${result.rowCount} rows in table ${table} for user ID \x1b[31m${oldUserId}\x1b[0m to \x1b[32m${newUserId}\x1b[0m`
      );
      i++;
    }
  } catch (error) {
    console.error("Error updating user IDs:", error);
  }
}

(async () => {
  try {
    await client.connect();
    let i = 0;
    for (const user of users) {
      await updateUserId(user.old, user.new, i);
      i++;
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
})();
