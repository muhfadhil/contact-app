import express from "express";
import expressLayouts from "express-ejs-layouts";
import { loadContacts, findContact, addContact, cekDuplikat, deleteContact } from "./utils/contacts.js";
import { body, check, validationResult } from "express-validator";
import session from "express-session";
import { flash } from "express-flash-message";

const app = express();
const port = 3000;

// set view engine
app.set("view engine", "ejs");

// middleware express layouts
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

// konfigurasi express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 6000,
    },
  })
);

// konfigurasi express-flash-message middleware
app.use(flash({ sessionKeyName: "flashMessage" }));

// Halaman home
app.get("/", (req, res) => {
  res.render("home", {
    title: "Halaman home",
    layout: "layouts/mainLayout",
  });
});

// halaman about
app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman about",
    layout: "layouts/mainLayout",
  });
});

// halaman contact
app.get("/contact", async (req, res) => {
  const contacts = loadContacts();
  const msg = await req.consumeFlash("msg");

  res.render("contact", {
    title: "Halaman contact",
    layout: "layouts/mainLayout",
    contacts,
    msg,
  });
});

// halaman tambah contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Halaman tambah contact",
    layout: "layouts/mainLayout",
  });
});

// halaman proses data
app.post(
  "/contact",
  [
    body("nim").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("NIM yang Anda masukkan telah terdaftar.");
      }
      return true;
    }),
    check("nohp", "Format nomor tidak sesuai!").isMobilePhone("id-ID"),
    check("email", "Format email tidak sesuai!").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Halaman tambah contact",
        layout: "layouts/mainLayout",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      // kirimkan flash
      await req.flash("msg", "Kontak berhasil ditambahkan!");
      res.redirect("/contact");
    }
  }
);

// hapus kontak
app.get("/contact/delete/:nim", async (req, res) => {
  const contact = findContact(req.params.nim);

  // jika contact tidak ditemukan
  if (!contact) {
    res.send("<h1>404</h1>");
    res.status(404);
  } else {
    deleteContact(req.params.nim);
    // kirimkan flash
    await req.flash("msg", "Kontak berhasil dihapus!");
    res.redirect("/contact");
  }
});

// halaman edit kontak
app.post("/contact/edit/:nim", (req, res) => {
  res.render("edit-contact", {
    title: "Halaman edit contact",
    layout: "layouts/mainLayout",
  });
});

// halaman detail contact
app.get("/contact/:nim", (req, res) => {
  const contact = findContact(req.params.nim);

  res.render("detail", {
    title: "Halaman detail Contact",
    layout: "layouts/mainLayout",
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
