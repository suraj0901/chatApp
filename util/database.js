import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
// import db from '../static/data.json';

const dbfile = resolve('static/data.json');

export const add = (newData) => {
  let error = false,
    success = false;
  db.push(newData);
  try {
    writeFileSync(JSON.stringify(db), dbfile);
    success = true;
  } catch (err) {
    error = err;
  } finally {
    return [success, error];
  }
};

export const get = () => {
  let error = false,
    success = false;
  try {
    success = readFileSync(dbfile, 'utf8');
  } catch (err) {
    error = err;
  } finally {
    return [success, error];
  }
};
