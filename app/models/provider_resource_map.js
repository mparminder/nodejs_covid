module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      resource_id: {
        type: mongoose.Types.ObjectId,
        ref: 'resources'
      },
      other_details: String,
      quantity: Number,
      active: Number
    },
    { timestamps: true }
  );


  return mongoose.model("provider_resource_map", schema);
};
