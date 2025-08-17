import mongoose from 'mongoose';
import bcrypt from "bcrypt"
const AddressSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g., Home, Office
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  isDefault: { type: Boolean, default: false },
});


const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    }, 
phone:{
  type: Number ,
  required:true,
  unique:true,
},
    name: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    refreshToken: {
  type: String,
  default: null
},
    isBanned:{
        type: Boolean,
      default: false
    },      
  roles: { type: [String], enum: ['customer','partner','admin'], default: ['customer'] },
  addresses: {
    type: [AddressSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5']
  }    },
  {
    timestamps: true,
    versionKey: false 
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with stored password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id.toString(), // Change _id to id
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id.toString(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d",
    }
  );
};

// Generate Password Reset Token
userSchema.methods.generatePasswordResetToken = async function () {
  const resetToken = jwt.sign(
    { id: this._id.toString() },
    process.env.RESET_TOKEN_SECRET || "reset_secret",
    { expiresIn: "1h" }
  );

  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 3600 * 1000; // 1 hour

  await this.save(); // Ensure changes are saved
  return resetToken;
};

// Set New Password (called after token verification)
userSchema.methods.setNewPassword = async function (newPassword) {
  this.password = await bcrypt.hash(newPassword, 10);
  this.passwordResetToken = null;
  this.passwordResetExpires = null;
  await this.save();
};

export  const User = mongoose.model("User", userSchema);

//new

// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

// const addressSchema = new mongoose.Schema({
//   label: String,
//   line1: String,
//   line2: String,
//   city: String,
//   state: String,
//   country: String,
//   pincode: String,
//   location: { type: { type: String, enum: ['Point'] }, coordinates: [Number] } // [lng, lat]
// }, { _id: false });

// addressSchema.index({ location: '2dsphere' });

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, lowercase: true, unique: true, sparse: true },
//   phone: { type: String, unique: true, sparse: true },
//   passwordHash: { type: String, required: true, select: false },
//   roles: { type: [String], enum: ['customer','partner','admin'], default: ['customer'] },
//   avatarUrl: String,
//   addresses: [addressSchema],
//   isActive: { type: Boolean, default: true },
//   passwordChangedAt: Date,
//   resetTokenHash: { type: String, select: false },
//   resetTokenExpiresAt: Date,
//   lastLoginAt: Date
// }, { timestamps: true });

// userSchema.index({ isActive: 1 });
// userSchema.methods.verifyPassword = function (pwd) {
//   return bcrypt.compare(pwd, this.passwordHash);
// };
// userSchema.pre('save', async function() {
//   if (this.isModified('passwordHash')) this.passwordChangedAt = new Date();
// });

// export const User = mongoose.model('User', userSchema);
