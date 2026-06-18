const asyncHandler = require('../utils/asyncHandler');
const analyticsModel = require('../models/analyticsModel');

const dashboard = asyncHandler(async (req, res) => {
  const [summary, sales] = await Promise.all([
    analyticsModel.summary(),
    analyticsModel.sales()
  ]);
  res.json({
    success: true,
    data: {
      summary,
      sales
    }
  });
});

module.exports = {
  dashboard
};
