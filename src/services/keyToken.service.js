'use strict'

const keyTokenModel = require("../models/keyToken.model")
const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({ userID, publicKey, privateKey, refreshToken }) => {
        try {
            // lvl0
            // const token = await keyTokenModel.create({
            //     user:  userID,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })

            // return token ? publickeyString : null

            // lvl xx
            const
                filter = { user: userID },
                update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
                options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findUserID = async (userID) => {
        return await keyTokenModel.findOne({ user: userID })
    }

    static removeKeyByID = async (id) => {
        const result = await keyTokenModel.deleteOne({
            _id: id
        }).lean()
        return result;
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken })
    }

    static deleteKeyByUserID = async (userID) => {
        const id = new Types.ObjectId(userID)
        return await keyTokenModel.deleteOne({ user: id })
    }
}

module.exports = KeyTokenService
