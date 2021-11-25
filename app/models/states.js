module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      active: Number,
      custom_id:Number
    },
    { timestamps: true }
  );

  const States = mongoose.model("states", schema);
  return States;
};
