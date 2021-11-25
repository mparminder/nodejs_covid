module.exports = mongoose => {
  let providerResourceMap = require('mongoose').model('provider_resource_map').schema
  var schema = mongoose.Schema(
    {
      org_name: String,
      org_address: String,
      pincode: Number,
      phone: String,
      last_verified: String,
      other_details: String,
      resources: [providerResourceMap],
      hashValue:String,
      state: {
        type: mongoose.Types.ObjectId,
        ref: 'states'
      },
      usefulCount:{
        type:Number,
        default:0
      },
      notUseFulCount:{
        type:Number,
        default:0
      },
      pos:{
        type:Number,
        default:0
      },
      city:String
    },
    { timestamps: true }
  );

  const provider = mongoose.model("providers", schema);
  return provider;
};
