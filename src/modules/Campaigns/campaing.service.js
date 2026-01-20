class CampaignService {
  constructor(campaignRepository) {
    this.campaignRepository = campaignRepository;
  }
  
  async getAllCampaigns(queryObject) {
    return await this.campaignRepository.getAllCampaigns(queryObject);
  }

  async getCampaignById(id) {
    const campaign = await this.campaignRepository.getCampaignById(id);

    if (!campaign) throw new Error(`Campaña con id ${id} no existe`);

    return campaign;
  }

  async createCampaign(data) {
    const createdCampaign = await this.campaignRepository.createCampaign(data);

    if (!createdCampaign)
      throw new error(
        "No se pudo crear la campaña. Por favor intenta mas tarde"
      );

    return await createdCampaign;
  }

  async updateCampaign(id, data) {
    const updatedCampaign = await this.campaignRepository.updateCampaign(
      id,
      data
    );

    if (updatedCampaign) return updatedCampaign;

    return await this.getCampaignById(id);
  }

  async deactivateCampaign(id) {
    return await CAMP.findByIdAndUpdate(id, {
      active: false,
    });
  }
}

module.exports = CampaignService;
