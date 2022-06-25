import fs from "fs";

// membuat folder data jika belum ada
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file contacts.json jika belum ada
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// load contacts
const loadContacts = () => {
  const dataBuffer = fs.readFileSync(dataPath, "utf-8");
  const contacts = JSON.parse(dataBuffer);
  return contacts;
};

// find contact
const findContact = (nim) => {
  const contacts = loadContacts();

  const contact = contacts.find((contact) => contact.nim === nim);
  return contact;
};

// menimpa data contacts.json dengan data baru
const saveContacts = (contacts) => {
  fs.writeFileSync(dataPath, JSON.stringify(contacts));
};

// add contact
const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContacts(contacts);
};

// fungsi untuk cek duplikat nim
const cekDuplikat = (nim) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.nim === nim);
};

// fungsi hapus kontak
const deleteContact = (nim) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter((contact) => contact.nim !== nim);
  saveContacts(filteredContacts);
};

export { loadContacts, findContact, addContact, cekDuplikat, deleteContact };
