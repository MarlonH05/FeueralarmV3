// ⚠️ ACHTUNG: Diese Datei enthält Zugangsdaten!
// NIEMALS in Git committen!
// Nur lokal zum Erstellen der Benutzer verwenden!

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// MongoDB Connection String (hardcoded)
const MONGO_URI = "mongodb+srv://alarmbso_db_user:Im6KCiingzZw1X50@feueralarmdb.rg6bjlr.mongodb.net/feueralarm?retryWrites=true&w=majority";

// User Model
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String },
});

const User = mongoose.model("User", userSchema);

// Benutzer-Daten
const users = [
  {
    username: "verwaltung",
    password: "Verwaltung2024!",
    role: "user",
    description: "Schulverwaltung",
  },
  {
    username: "lehrer1",
    password: "Lehrer2024!",
    role: "user",
    description: "Lehrer 1",
  },
  {
    username: "lehrer2",
    password: "Lehrer2024!",
    role: "user",
    description: "Lehrer 2",
  },
  {
    username: "lehrer3",
    password: "Lehrer2024!",
    role: "user",
    description: "Lehrer 3",
  },
  {
    username: "lehrer4",
    password: "Lehrer2024!",
    role: "user",
    description: "Lehrer 4",
  },
  {
    username: "admin",
    password: "Admin2024!Secure",
    role: "admin",
    description: "Schul-IT Admin",
  },
];

async function createUsers() {
  try {
    // MongoDB Verbindung
    console.log("🔗 Verbinde mit MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Verbindung erfolgreich!\n");

    // Alle bestehenden User anzeigen
    const existingUsers = await User.find({});
    console.log(`ℹ️  Aktuell ${existingUsers.length} Benutzer in der Datenbank\n`);

    // Jeden Benutzer erstellen
    for (const userData of users) {
      try {
        // Prüfen ob User bereits existiert
        const existingUser = await User.findOne({ username: userData.username });

        if (existingUser) {
          console.log(`⚠️  ${userData.description} (${userData.username}) existiert bereits - übersprungen`);
          continue;
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // User erstellen
        const newUser = new User({
          username: userData.username,
          password: hashedPassword,
          role: userData.role,
        });

        await newUser.save();
        console.log(`✅ ${userData.description} erstellt:`);
        console.log(`   👤 Username: ${userData.username}`);
        console.log(`   🔑 Passwort: ${userData.password}`);
        console.log(`   🎭 Rolle: ${userData.role}\n`);
      } catch (error) {
        console.error(`❌ Fehler bei ${userData.description}:`, error.message, "\n");
      }
    }

    // Finale Übersicht
    const finalUsers = await User.find({});
    console.log(`\n📊 Gesamtanzahl Benutzer: ${finalUsers.length}`);
    console.log("\n🎉 Fertig! Alle Benutzer wurden erstellt.\n");

    // Übersicht der Accounts ausgeben
    console.log("═══════════════════════════════════════════════════════════");
    console.log("                  📋 ACCOUNT-ÜBERSICHT");
    console.log("═══════════════════════════════════════════════════════════\n");

    for (const userData of users) {
      console.log(`${userData.description}:`);
      console.log(`  Username: ${userData.username}`);
      console.log(`  Passwort: ${userData.password}`);
      console.log(`  Rolle:    ${userData.role}`);
      console.log("");
    }

    console.log("═══════════════════════════════════════════════════════════");
    console.log("⚠️  WICHTIG: Speichere diese Zugangsdaten sicher!");
    console.log("═══════════════════════════════════════════════════════════\n");
  } catch (error) {
    console.error("❌ Fehler:", error.message);
    console.error("Details:", error);
  } finally {
    // Verbindung schließen
    await mongoose.connection.close();
    console.log("🔌 MongoDB Verbindung geschlossen");
    process.exit(0);
  }
}

// Skript ausführen
createUsers();
