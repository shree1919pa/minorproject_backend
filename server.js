// ------------------- TRANSLATIONS ROUTES ------------------- //

// Get artifact with translation (if available)
app.get("/artifacts/:id/translation/:lang", (req, res) => {
  const { id, lang } = req.params;

  const sql = `
    SELECT a.artifact_id, 
           COALESCE(t.translated_name, a.name) AS name,
           COALESCE(t.translated_description, a.description) AS description,
           a.origin, a.year_estimated, a.image_url,
           c.category_name, l.language_name
    FROM Artifacts a
    LEFT JOIN Categories c ON a.category_id = c.category_id
    LEFT JOIN Languages l ON l.language_name = ?
    LEFT JOIN Artifact_Translations t 
           ON a.artifact_id = t.artifact_id 
           AND l.language_id = t.language_id
    WHERE a.artifact_id = ?
  `;

  db.query(sql, [lang, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Artifact not found" });
    res.json(results[0]);
  });
});

// Add translation (admin only)
app.post("/artifacts/:id/translation", authenticateToken, authorizeRole(["admin"]), (req, res) => {
  const { id } = req.params;
  const { language_id, translated_name, translated_description } = req.body;

  const sql = `
    INSERT INTO Artifact_Translations (artifact_id, language_id, translated_name, translated_description)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      translated_name = VALUES(translated_name),
      translated_description = VALUES(translated_description)
  `;

  db.query(sql, [id, language_id, translated_name, translated_description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "✅ Translation added/updated" });
  });
});

// Get all available translations for an artifact
app.get("/artifacts/:id/translations", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT t.translation_id, l.language_name, t.translated_name, t.translated_description
    FROM Artifact_Translations t
    JOIN Languages l ON t.language_id = l.language_id
    WHERE t.artifact_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
