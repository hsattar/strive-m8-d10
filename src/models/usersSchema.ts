import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser } from '../types/userInterface'

const { Schema, model } = mongoose

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true}
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

export default model<IUser>('User', userSchema)