import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const dbfile = resolve('static/data.json');

export const add = async (newData) => {
  let error = false,
    success = false;
  try {
    const file = await readFileSync(dbfile, 'utf8');
    const db = await JSON.parse(file);
    db.push(newData);
    await writeFileSync(dbfile, JSON.stringify(db));
    success = true;
  } catch (err) {
    error = err;
  }
  return [success, error];
};

export const get = async () => {
  let error = false,
    success = false;
  try {
    success = await readFileSync(dbfile, 'utf8');
    success = JSON.parse(success);
  } catch (err) {
    error = err;
  } finally {
    return [success, error];
  }
};
