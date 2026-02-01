const CAMP = require("./campaign.model");
const flatten = require("./../../../utils/flatten");

class CampaignRepository {
  async getAllCampaigns(queryObject) {
    let query = CAMP.find(queryObject);
    return await query.sort({ name: 1 });
  }

  async getCampaignById(id) {
    return await CAMP.findById(id);
  }

  async createCampaign(data) {
    return await CAMP.create(data);
  }

  async updateCampaign(id, data) {
    const updateObject = flatten(data);

    return await CAMP.findByIdAndUpdate(
      id,
      {
        $set: updateObject,
      },
      { new: true },
    );
  }

  async deactivateCampaign(id) {
    return await CAMP.findByIdAndUpdate(id, {
      active: false,
    });
  }
}

module.exports = CampaignRepository;
