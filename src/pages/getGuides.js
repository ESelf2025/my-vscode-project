// src/api/getGuides.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../pages/Firebase"; // make sure this path is correct

export const getGuides = async () => {
  const guidesCollection = collection(db, "guides");
  const guidesSnapshot = await getDocs(guidesCollection);

  const guides = [];
  guidesSnapshot.forEach((doc) => {
    guides.push({ id: doc.id, ...doc.data() });
  });

  return guides;
};
