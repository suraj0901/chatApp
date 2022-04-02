const users = {
  "Mohit Pandey": "great#667",
  "Suraj Yadav": "smart#898",
  "Akash Jaiswal": "gota#323",
  "Suraj Jha": "123",
  "Prince Dubey": "charming#486",
};

export default (map) => {
  for (const user in users) {
    map.set(user, {
      password: users[user],
    });
  }
};
