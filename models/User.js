// models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String, required: true
    },
    slug: {
        type: String, lowercase: true
    },

    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    passwordChangeAt: {
        type: Date
    },

    passwordRestCode: {
        type: String,
    },
    passwordRestCodeExpire: {
        type: Date
    },
    passwordRestVerified: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
    },


}, { timestamps: true });



userSchema.post("init", function (doc) {
    if (doc.profileImage) {
        const imageUrl = `${process.env.BASE_URL}/uploads/${doc.profileImage}`;
        doc.profileImage = imageUrl
    }
});
userSchema.pre('save', async function (next) {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
        next()
    }
    next();
})



const User = mongoose.model('User', userSchema);

export default User;
