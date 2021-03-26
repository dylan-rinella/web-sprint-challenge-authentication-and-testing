const router = require("express").Router();
const db = require("../../data/dbConfig");
const secure = require("bcryptjs");
const jwt = require("jsonwebtoken");

//add new user:
const dbAdd = async (user) => {
  const [id] = await db("users").insert(user);
  return dbFindById(id);
};

//find user from id:
const dbFindById = (id) => {
  return db("users").select("id", "username", "password").where({ id }).first();
};

//find user with filter:
const dbFindByFilter = (filter) => {
  return db("users").select("id", "username", "password").where(filter).first();
};

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
      if (!username || !password) {
        return res.status(406).json({
          message: "username and password required",
        })
      }
      const user = await dbFindByFilter({ username });
      if (user) {
        return res.status(409).json({
          message: "This user already exists",
        })
      }
      const newUser = await dbAdd({
        username: username,
        password: await secure.hash(password, process.env.HASH_LOOP),
      })
    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }
})

router.post("/login", (req, res) => {
  const { username, password } = req.body
  dbFindByFilter({ username })
    .then((user) => {
      if (user && secure.compareSync(password, user.password)) {
        const token = jwt.sign(
          {
            userID: user.id,
          },
          process.env.JWT_VERIFY
        )
        res.status(200).json({
          message: `Welcome ${user.username}`,
          token: token,
        })
      } else {
        res.status(401).json({
          message: `invalid credentials`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    })
  })

  module.exports = router