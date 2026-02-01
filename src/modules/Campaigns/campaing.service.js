const { scopeCampaignByUser } = require("./../../policies/campaign.policies");
const Prospect = require("./../../../models/Prospect");

class CampaignService {
  constructor(
    campaignRepository,
    cicloRepository,
    iesRepository,
    iemsRepository,
  ) {
    this.campaignRepository = campaignRepository;
    this.cicloRepository = cicloRepository;
    this.iesRepository = iesRepository;
    this.iemsRepository = iemsRepository;
  }

  async getAllCampaigns(user, queryObject) {
    console.log(user);

    queryObject = scopeCampaignByUser(user);

    console.log(queryObject);

    const campaigns = await this.campaignRepository.getAllCampaigns(queryObject);
    if (campaigns.length === 0) return campaigns;

    const campaignIds = campaigns.map((c) => c._id);
    const stats = await Prospect.aggregate([
      { $match: { originCampaign: { $in: campaignIds } } },
      {
        $group: {
          _id: "$originCampaign",
          totalRegistrados: { $sum: 1 },
          totalCompletos: {
            $sum: { $cond: ["$processStatus.registrationComplete", 1, 0] },
          },
        },
      },
    ]);
    const statsMap = new Map(
      stats.map((s) => [s._id.toString(), { totalRegistrados: s.totalRegistrados, totalCompletos: s.totalCompletos }])
    );

    return campaigns.map((c) => {
      const cId = c._id.toString();
      const s = statsMap.get(cId) || { totalRegistrados: 0, totalCompletos: 0 };
      return {
        ...c.toObject ? c.toObject() : c,
        totalRegistrados: s.totalRegistrados,
        totalCompletos: s.totalCompletos,
      };
    });
  }

  async getCampaignById(id) {
    const campaign = await this.campaignRepository.getCampaignById(id);

    if (!campaign) throw new Error(`Campaña con id ${id} no existe`);

    const [stats] = await Prospect.aggregate([
      { $match: { originCampaign: campaign._id } },
      {
        $group: {
          _id: null,
          totalRegistrados: { $sum: 1 },
          totalCompletos: {
            $sum: { $cond: ["$processStatus.registrationComplete", 1, 0] },
          },
        },
      },
    ]);
    const result = campaign.toObject ? campaign.toObject() : campaign;
    result.totalRegistrados = stats ? stats.totalRegistrados : 0;
    result.totalCompletos = stats ? stats.totalCompletos : 0;
    return result;
  }

  async createCampaign(data) {
    const { iesId } = data.ies;

    const iesExists = await this.iesRepository.getIESById(iesId);

    if (!iesExists) throw new Error("Esta ies no existe");

    data.ies.iesName = iesExists.name;

    const iems = data.targetedIEMS;
    // let index = 0;

    await Promise.all(
      iems.map(async (iem, index) => {
        const iemExists = await this.iemsRepository.getIEMSById(iem.iemsId);

        if (!iemExists) throw new Error(`IEM con id: ${iem.iemsId} no existe`);

        iems[index].iemsName = iemExists.name;
      }),
    );

    const { cycleId } = data.cycle;

    const cycleExists = await this.cicloRepository.getCicloById(cycleId);

    if (!cycleExists)
      throw new Error(
        `Ciclo con el id: ${cycleId} no existe. Verifica e intenta de nuevo`,
      );

    data.cycle.cycleName = cycleExists.name;

    const createdCampaign = await this.campaignRepository.createCampaign(data);

    if (!createdCampaign)
      throw new error(
        "No se pudo crear la campaña. Por favor intenta mas tarde",
      );

    return await createdCampaign;
  }

  async updateCampaign(id, data) {
    const updatedCampaign = await this.campaignRepository.updateCampaign(
      id,
      data,
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
