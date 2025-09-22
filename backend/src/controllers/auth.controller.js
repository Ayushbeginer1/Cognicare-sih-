export const register = (req, res) => {
  try {
    const { name, email, password } = req.body;
    res.status(201).json({ message: "User registered successfully", user: { name, email } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;
    res.status(200).json({ message: "User logged in successfully", user: { email } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};