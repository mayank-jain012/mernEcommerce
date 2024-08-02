import mongoose from 'mongoose' // Erase if already required
import bcrypt from 'bcrypt'
import crypto from 'crypto'
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileno: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist"
    }],
    address: {
        type: String
    },
    refreshToken: {
        type: String
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    outstandingAmount: {
        type: Number,
        default: 0
    },
    visits: {
        type: Number,
        default: 0,
    },
    passwordChangeAt: Date,
    passwordExpiresIn: String,
    passwordResetIn: String,
}, {
    timestamps: true
});
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ mobileno: 1 }, { unique: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified(this.password)) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetIn = crypto.createHash('sha26').update(resetToken).digest("hex");
    this.passwordExpiresIn = Date.now() + 36 * 60 * 1000;
    return resetToken;
}

//Export the model
export const User = mongoose.model('User', userSchema);