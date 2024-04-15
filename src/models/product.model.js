'use strict'

const {model, Schema} = require("mongoose");

const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME= 'Products'

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: String,
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    product_slug: {
        type: String
    },
    // More
    product_rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be under 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false}, // Select ko show ra khi minh FindOne 
    isPublish: {type: Boolean, default: false, index: true, select: false},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
// Middleware
// create index for search
productSchema.index({product_name: 'text', product_description: 'text'})
productSchema.pre('save', async function( next ) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next();
})
const clothingSchema = new Schema({
    brand: {type: String, require: true},
    size: String,
    meterial: String,
    product_shop: {type: Schema.Types.ObjectId, ref: "Shop"}
}, {
    collection: "clothes",
    timestamps: true
})

const electronicSchema = new Schema({
    manufacturer: {type: String, require: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: "Shop"}
}, {
    collection: "electronic",
    timestamps: true
})

const furnitureSchema = new Schema({
    manufacturer: {type: String, require: true},
    brand: String,
    meterial: String,
    size: String,
    product_shop: {type: Schema.Types.ObjectId, ref: "Shop"}
}, {
    collection: "furniture",
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronic', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema),
}
