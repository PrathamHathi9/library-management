const mongoose = require('mongoose');
const { Timestamp } = require('typeorm');

const schema = mongoose.Schema(
    {
        title : {
            type : String
        },
        genre : {
            type : String
        },
        author : {
            type : String
        },
        coverImage : {
            name : String,
            desc : String,
            img :
            {
                data : String
            }
        },
        file : {
            type : String
        }
    },
    {
        Timestamp : true
    }
)

const bookSchema = ('books', schema);
module.exports = bookSchema;