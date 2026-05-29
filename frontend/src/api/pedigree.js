import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const predictInheritance = async (familyData) => {
  try {

    const response = await axios.post(
      `${API_BASE}/predict`,
      familyData
    );

    return response.data;

  } catch (error) {

    console.error("API Error:", error);

    return null;
  }
};

