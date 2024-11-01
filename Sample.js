db.collectionName.find({
  timestamp: {
    $gte: ISODate("2024-11-01T05:00:00.000+00:00"),
    $lte: ISODate("2024-11-01T19:00:00.000+00:00")
  },
  $expr: {
    $and: [
      { $eq: [{ $minute: "$timestamp" }, 0] },
      { $eq: [{ $second: "$timestamp" }, 0] }
    ]
  }
})
