import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const dbfile = resolve('static/data.json');

export const add = async (newData) => {
  console.log('ADD');
  let error = false,
    success = false;
  try {
    const file = await readFileSync(dbfile, 'utf8');
    const db = await JSON.parse(file);
    db.push(newData);
    console.log(db);
    await writeFileSync(dbfile, JSON.stringify(db));
    console.log('success');
    success = true;
  } catch (err) {
    error = err;
  }
  return [success, error];
};

export const get = async () => {
  console.log('GET');
  let error = false,
    success = false;
  try {
    success = await readFileSync(dbfile, 'utf8');
  } catch (err) {
    error = err;
  } finally {
    return [success, error];
  }
};
