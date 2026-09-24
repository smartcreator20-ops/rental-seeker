import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const data = await request.json();

    const prompt =
      "Write a clear and attractive rental property description using these details.\n\n" +
      "Property title: " + data.title + "\n" +
      "City: " + data.city + "\n" +
      "Area: " + data.area + "\n" +
      "Property type: " + data.propertyType + "\n" +
      "Floor number: " + (data.floorNumber || "Not provided") + "\n" +
      "Total floors: " + (data.totalFloors || "Not provided") + "\n" +
      "Monthly rent: ₹" + data.rent + "\n" +
      "Carpet area: " + (data.carpetArea ? data.carpetArea + " sq. ft." : "Not provided") + "\n" +
      "Security deposit: " + (data.securityDeposit ? "₹" + data.securityDeposit : "Not provided") + "\n" +
      "Rent negotiable: " + (data.rentNegotiable ? "Yes" : "No") + "\n\n" +
      "Write 80-120 words.\n" +
      "Use only the information provided.\n" +
      "Do not invent amenities, facilities, furnishing, parking, views, nearby landmarks, society features, or other property features.";

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return Response.json({
      description: response.text,
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return Response.json(
      {
        error: "Unable to generate description.",
      },
      {
        status: 500,
      }
    );
  }
}