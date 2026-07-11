import { Question } from "./types";

const parkingPermitLetter =
  "February 2\n\nDear Mr. Harding,\n\nThank you for calling today about obtaining an additional parking permit. Because we have (141)-------- parking spaces in our apartment complex, it is difficult for us to give out extra parking permits. However, if we do have any spots available, or if any spots become available, we will be happy to give you an additional parking permit as long as you meet the conditions. I am including the required application for the permit. While you (142)-------- for our response to your application, please review all the terms and conditions for parking with a permit to avoid getting a ticket. With an additional parking permit you can only park in lots 20 through 22. Please make certain that your permit is visible (143)-------- the front windshield.\n\nThank you.";

const nessCoverLetter =
  "Mr. David Ness\n29102 Angel Road\nAnaheim, CA 30328\n\nDear Mr. Ness,\n\nI am enclosing my resume for further review. I am impressed by your company's customer service and I would love to be a part of it. I have three years of customer service experience at a retail store and was named Employee of the Month twice.\n\n(144)-------- that your company thrives on a longstanding customer base, I believe that my communication skills would be an asset to your company. I believe that my background in dealing with a wide range of ages and ethnicities (145)-------- me to work with other staff members and customers in a professional capacity to meet their needs and support company (146)--------.\n\nPlease review my resume carefully. I would love the position and would be thrilled to work alongside your company to benefit the community and your revenues.\n\nSincerely,\nJohn Holland";

const insuranceLetter =
  "Dear Robert Franklin,\n\nI am writing to notify you of the current status of your apartment's renter's insurance. As of December 31, your insurance has expired. You must (147)-------- a new renter's insurance application before February 1. Failure to supply complete coverage of your rented property will (148)-------- in the termination of your lease for apartment #647 within the Hollister Apartment Communities of Orange County. Insurance will protect you and your family from fire, water, and wind damage and will also reimburse any losses (149)-------- in the case of theft. Please bring proof of insurance into the office of Resident Services before the deadline of February 1, 2012.\n\nSincerely,\nValerie Wong\nManager of Hollister Apartment Communities of Orange County";

const fireParadeArticle =
  "Next week, the city of Cerritos will host a parade for the fire department. The parade will (150)-------- fallen heroes who have tragically lost their lives to save others. These brave men have been sorely neglected and we would like to bring them to the forefront of our memories and remind ourselves that we are protected by these men every day. Their sacrifice was not in vain because the local firefighting community will always be (151)-------- to saving the lives of those caught in house and forest fires.\n\nResidents are invited to pay their (152)-------- and honor the men that fight fires daily and the men that have lost their lives to them.";

const questions: Question[] = [
  { id: 421, part: 6, set: 1, conversation: parkingPermitLetter, question: "141. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["limited", "abundant", "plenty of", "open"], answer: "A" },
  { id: 422, part: 6, set: 1, conversation: parkingPermitLetter, question: "142. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["will wait", "have waited", "waited", "are waiting"], answer: "D" },
  { id: 423, part: 6, set: 1, conversation: parkingPermitLetter, question: "143. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["out", "to", "through", "outside"], answer: "C" },
  { id: 424, part: 6, set: 1, conversation: nessCoverLetter, question: "144. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["Having", "Given", "Because", "Since"], answer: "B" },
  { id: 425, part: 6, set: 1, conversation: nessCoverLetter, question: "145. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["allows", "allowed", "is allowing", "has allowed"], answer: "A" },
  { id: 426, part: 6, set: 1, conversation: nessCoverLetter, question: "146. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["encouragement", "assistance", "development", "flaws"], answer: "C" },
  { id: 427, part: 6, set: 1, conversation: insuranceLetter, question: "147. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["understand", "agree", "complete", "acknowledge"], answer: "C" },
  { id: 428, part: 6, set: 1, conversation: insuranceLetter, question: "148. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["give", "have", "result", "drag"], answer: "C" },
  { id: 429, part: 6, set: 1, conversation: insuranceLetter, question: "149. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["incurring", "incurred", "incurs", "be incurred"], answer: "B" },
  { id: 430, part: 6, set: 1, conversation: fireParadeArticle, question: "150. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["receive", "honor", "understand", "treat"], answer: "B" },
  { id: 431, part: 6, set: 1, conversation: fireParadeArticle, question: "151. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["dedicated", "dedicating", "dedication", "dedicate"], answer: "A" },
  { id: 432, part: 6, set: 1, conversation: fireParadeArticle, question: "152. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["money", "earnings", "glory", "respects"], answer: "D" },
];

export default questions;
