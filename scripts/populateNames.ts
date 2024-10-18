import Bottleneck from "bottleneck";

export interface User {
  ok: boolean;
  profile?: Profile;
  error?: string;
}
export interface Profile {
  title: string;
  phone: string;
  skype: string;
  real_name: string;
  real_name_normalized: string;
  display_name: string;
  display_name_normalized: string;
  fields: null;
  status_text: string;
  status_emoji: string;
  status_emoji_display_info: any[];
  status_expiration: number;
  avatar_hash: string;
  image_original: string;
  is_custom_image: boolean;
  email: string;
  pronouns: string;
  huddle_state: string;
  huddle_state_expiration_ts: number;
  first_name: string;
  last_name: string;
  image_24: string;
  image_32: string;
  image_48: string;
  image_72: string;
  image_192: string;
  image_512: string;
  image_1024: string;
  status_text_canonical: string;
  team: string;
}

import { Client } from "pg";

const prodClient = new Client(process.env.DATABASE_URL);

prodClient.connect();
let usersToPopulate: string[] = [];

try {
  const res = await prodClient.query(
    "SELECT id FROM users WHERE name = '' OR name = 'undefined';"
  );
  usersToPopulate = res.rows.map((row) => row.id);

  console.log(usersToPopulate.length, "users have empty names", "\n\n");

  // Create a rate limiter with a maximum of 10 requests per second
  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: (50 / 60) * 1000, // 50 req a minute
  });

  let names: { id: string; name: string }[] = [];

  let problemIDs: string[] = [];

  let i = 0;
  for (const user of usersToPopulate) {
    await limiter.schedule(async () => {
      const res: User = await fetch(
        "https://slack.com/api/users.profile.get?user=" + user,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
          },
          body: `user=${user}`,
        }
      ).then((res) => res.json());

      if (!res.ok) {
        problemIDs.push(user);
      }

      const longestNameLength = names.reduce(
        (max, name) => Math.max(max, name.name.length),
        0
      );

      let name =
        res.profile?.display_name_normalized.length! > 0
          ? res.profile?.display_name_normalized
          : res.profile?.real_name_normalized;

      process.stdout.write(
        "\r" +
          i +
          "/" +
          usersToPopulate.length +
          " at " +
          Math.round((50 / 60) * 10) / 10 +
          " per sec; finished in " +
          Math.round((usersToPopulate.length - i) / (50 / 60)) +
          "s; name=" +
          name?.padEnd(Math.max(0, longestNameLength - name?.length + 3), " ")
      );

      if (res.ok) {
        names.push({
          id: user,
          name: res.profile?.display_name_normalized!,
        });
      }
      i++;
    });
  }

  console.log("Successfully got the names of", names.length, "users");

  // insert back into the db
  let queryString = "";
  for (const name of names) {
    queryString += `
      UPDATE users
      SET name = '${name.name}'
      WHERE id = '${name.id}';
    `;
  }

  await prodClient.query(queryString.trim());
  console.log("problemIDs:", problemIDs);
} catch (error) {
  console.error("Error fetching user by email:", error);
} finally {
  prodClient.end();
}
