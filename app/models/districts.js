module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      state_custom_id: Number,
      active: Number,
      custom_id:Number
    },
    { timestamps: true }
  );

  const Districts = mongoose.model("districts", schema);
  return Districts;
};
