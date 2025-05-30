const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "dittlösenord",
    database: "api",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testa anslutningen
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database!");
    connection.release();
});
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM posts");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: "Post not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


router.post("/", async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ error: "Title and content required" });

        const [result] = await db.query("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content]);
        res.status(201).json({ id: result.insertId, title, content });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ error: "Title and content required" });

        const [result] = await db.query("UPDATE posts SET title = ?, content = ? WHERE id = ?", [title, content, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Post not found" });

        res.json({ id: req.params.id, title, content });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Post not found" });

        res.json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const [result] = await db.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword]
        );

        res.status(201).json({ id: result.insertId, username });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

       
        const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = rows[0];


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

   
        res.json({ id: user.id, username: user.username });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
module.exports = router;
module.exports = pool.promise();
