import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const dbfile = resolve('static/data.json');

export const add = async (newData) => {
  let error = false,
    success = false;
  try {
    const file = readFileSync(dbfile, 'utf8');
    const db = await JSON.parse(file);
    db.push(newData);
    writeFileSync(dbfile, JSON.stringify(db));
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

export const users = () => {
  const list = {
    'Mohit Pandey': 'great#667',
    'Suraj Yadav': 'smart#898',
    'Akash Jaiswal': 'gota#323',
    'Suraj Jha': 'owner#7890',
    'Prince Dubey': 'charming#486',
  };

  return {
    find({ name, password }) {
      const pass = list.get(name, false);
      if (pass && password === pass) {
        const token = Array(64)
          .fill(0)
          .map((x) => Math.random().toString(36).charAt(2))
          .join('');
        return token;
      }
      return false;
    },
  };
};
