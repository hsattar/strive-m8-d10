import { Model, Document } from 'mongoose'

export interface IUser {
    _id: string
    firstName: string
    lastName: string
    email: string
    password: string
    refreshToken: string
}

export type IUserDoc = IUser & Document

export interface UserModel extends Model<IUser> {
    authenticate(email: string, password: string): IUser | null
}