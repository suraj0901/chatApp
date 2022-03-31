import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const dbfile = resolve('./lib/data.json');

export const add = async (newData) => {
  try {
    const file = readFileSync(dbfile, 'utf8');
    const db = await JSON.parse(file);
    db.push(newData);
    writeFileSync(dbfile, JSON.stringify(db));
    return true;
  } catch (err) {
    console.log(err);
  }
};

export const get = async () => {
  try {
    const success = readFileSync(dbfile, 'utf8');
    return await JSON.parse(success);
  } catch (err) {
    console.log(err);
  }
};
