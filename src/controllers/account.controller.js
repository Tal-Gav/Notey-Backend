import { Account } from "../models/account.model.js";
import { generateAccessToken } from "../middlewares/auth.js";

// Create a new account
export const signupAccount = async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(400).send({
        message:
          "Send all required fields: firstName, lastName, email, password.",
      });
    }

    const newAccount = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };

    const account = await Account.create(newAccount);
    const token = generateAccessToken(account._id);

    return (
      res
        // .cookie("jwt", token, { httpOnly: true, maxAge: "3600000" })
        .json({ message: "Account created.", token })
    );
  } catch (error) {
    console.log(error.message);

    if (error.code === 11000) {
      res.status(500).send({ message: "This email is already in use." });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

export const loginAccount = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.login(email, password);
    const token = generateAccessToken(account._id);
    return (
      res
        // .cookie("jwt", token, { httpOnly: true, maxAge: "3600000" })
        .json({ message: "Account logged in.", token })
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all the existing accounts
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({});

    return res.status(200).json({
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get an existing account by id
export const getAccountById = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findById(accountId).select(
      "firstName lastName email _id"
    );

    return res.status(200).json({ account });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Update an existing account by id
export const updateAccount = async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).send({
        message: "Send all required fields: firstName, lastName, email",
      });
    }

    const { id } = req.params;

    const result = await Account.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).send({ message: "Account updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Delete an existing account by id
export const deleteAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Account.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).send({ message: "Account deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
