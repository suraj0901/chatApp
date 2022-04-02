import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const dbfile = resolve("./db/data.json");

export const addMessage = async (newData) => {
  try {
    const file = readFileSync(dbfile, "utf8");
    const db = await JSON.parse(file);
    db.push(newData);
    writeFileSync(dbfile, JSON.stringify(db));
    return true;
  } catch (err) {
    console.log(err);
  }
};

export const allPrevMessage = async () => {
  try {
    const success = readFileSync(dbfile, "utf8");
    return await JSON.parse(success);
  } catch (err) {
    console.log(err);
  }
};
