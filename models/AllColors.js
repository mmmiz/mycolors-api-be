const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allColorSchema = new Schema({
  
  orderNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  mainColor: {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  aboutUsColor: String,
  productsColor: String,
  newsColor: String,
  contactColor: String,
  
  user: {
    type: mongoose.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  
  likes: [ 
    {
      type: Schema.Types.ObjectId,
      ref: 'User', 
    }
  ],
});

const AllColor = mongoose.model('AllColor', allColorSchema);
module.exports = AllColor;


