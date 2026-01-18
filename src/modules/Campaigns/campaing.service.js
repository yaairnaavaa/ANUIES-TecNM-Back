class CampaignService {
  constructor(campaignRepository) {
    this.campaignRepository = campaignRepository;
  }
  async getAllCampaigns(queryObject) {
    return await this.campaignRepository.getAllCampaigns(queryObject);
  }

  async getCampaignById(id) {
    return await CAMP.findById(id);
  }

  async createCampaign(data) {
    return await CAMP.create(data);
  }

  async updateCampaign(id, data) {
    return await CAMP.findByIdAndUpdate(id, data, { new: true });
  }

  async deactivateCampaign(id) {
    return await CAMP.findByIdAndUpdate(id, {
      active: false,
    });
  }
}

module.exports = CampaignService;
