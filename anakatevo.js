const { exiftool } = require("exiftool-vendored");

async function stripAndVerify(filePath) {
  try {
    // 1. Read metadata BEFORE
    const before = await exiftool.read(filePath);
    console.log("--- BEFORE STRIPPING ---");
    console.log(`Camera: ${before.Model || "Unknown"}`);
    console.log(
      `GPS: ${before.GPSLatitude ? "YES (Found Location!)" : "None"}`,
    );
    console.log(`Creator: ${before.Artist || "None"}`);

    // 2. Wipe everything (-all=)
    await exiftool.write(filePath, { all: "" }, ["-overwrite_original"]);
    console.log("\n✅ Success! Scrubbing all metadata...");

    // 3. Read metadata AFTER
    const after = await exiftool.read(filePath);
    console.log("\n--- AFTER STRIPPING ---");
    console.log(`Camera: ${after.Model || "REMOVED"}`);
    console.log(`GPS: ${after.GPSLatitude ? "STILL THERE ❌" : "REMOVED ✅"}`);
    console.log(`Creator: ${after.Artist || "REMOVED ✅"}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await exiftool.end();
  }
}

stripAndVerify("C:\\temp\\e631902b-97ab-4e63-945b-dfac448749ea.jpg");
