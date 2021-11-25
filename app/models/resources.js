module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      active: Number,
    },
    { timestamps: true }
  );

  const Resources = mongoose.model("resources", schema);
  return Resources;
};
