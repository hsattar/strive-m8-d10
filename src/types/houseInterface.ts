import { Types } from 'mongoose'

export interface IHouse {
    _id: string
    name: string
    host: Types.ObjectId
    description: string
    maxGuests: number    
}