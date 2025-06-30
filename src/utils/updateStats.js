import matchAPI from "../api/matchAPI";
export const updateStats = async () => {
  try {
    const res = await matchAPI.reCaculateMatches();
    return res;
  } catch (err) {
    console.error(err);
  }
};
