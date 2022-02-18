import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser, UserModel } from '../types/userInterface'

const { Schema, model } = mongoose

const userSchema = new Schema<IUser, UserModel>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: String
})

userSchema.pre('save', async function(next) {
    
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 11)
        this.password = hashedPassword        
    }

    next()
})

userSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.__v
    delete userObject.password
    return userObject
}

userSchema.statics.authenticate = async function(email, password) {
    const user = await this.findOne({ email })
    if (!user) return null
    const validCredentials = await bcrypt.compare(password, user.password)
    if (!validCredentials) return null
    return user
}

export default model<IUser, UserModel>('User', userSchema)