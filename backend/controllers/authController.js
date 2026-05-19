const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // validate required fields
if (!name || !email || !password) {
  return res.status(400).json({
    message: "Kaikki kentät ovat pakollisia / All fields are required"
  });
}

// basic email validation
if (!email.includes("@")) {
  return res.status(400).json({
    message: "Sähköposti ei ole oikeassa muodossa / Invalid email format"
  });
}

// password minimum length
if (password.length < 6) {
  return res.status(400).json({
    message: "Salasana täytyy olla vähintään 6 merkkiä"
  });
}

  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Käyttäjä on jo olemassa" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: req.body.role || "client"
    });

    // save user to database
    await user.save();

    // send response
    res.status(201).json({ message: "Käyttäjä luotu onnistuneesti" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // validate login fields
if (!email || !password) {
  return res.status(400).json({
    message: "Kaikki kentät ovat pakollisia / All fields are required"
  });
}

  try {
    //find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Sähköpostia ei löydy / Invalid email" });
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Salasana ei ole oikein / Invalid password" });
    }

    //generate the token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
