const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  streetAddress1: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  streetAddress2: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    unique: false,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    unique: false,
    trim: true,
  },
  zipcode: {
    type: String,
    required: true,
    unique: false,
    maxlength: 5,
    trim: true,
  },
  product: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  service: [
    {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
