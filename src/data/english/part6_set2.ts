import { Question } from "./types";

const welcomeEmail =
  "To: Jin-won Lee leejw@urmail.ca\nFrom: Nazarene Gaffar ngaffar@uxdesign.org\nDate: March 23\nSubject: Welcome\n\nDear Mr. Lee,\n\nI am writing to thank you for joining our organization. Please remember that we have now added your profile and contact details to our members' directory. (141)-------- we recommend that you review the directory online to ensure that your details are correct. If you find that anything is incorrect, you can make any (142)-------- yourself via the online form. Please note that if you would prefer not to appear in the directory, you can opt out by visiting the members' area of our Web site and checking the (143)-------- box at the foot of the page.\n\nThank you again for becoming a member, and welcome to our organization.\n\nBest regards,\nNazarene Gaffar\nPresident, User Experience Design Professionals Organization";

const promotionMemo =
  "To: All staff\nFrom: Andrei Pronin\nSubject: Promotion announcement\nDate: October 24\n\nIt's my pleasure to announce that, due to all her hard work and commitment this year, Kathy Ku has been promoted to Manager. She will begin her new role on the 1st of next month, and she will begin by (144)-------- responsibility for our purchasing operations.\n\nWorking within the Purchasing Department, Ms. Ku will be the first point of contact for all matters regarding purchasing. She will be responsible for leading, supervising and training her team, and, of course, (145)-------- contracts with new and existing suppliers.\n\nPlease join me on congratulating Ms. Ku on her promotion, and wishing her all the best in her new role. I am sure we will all make an effort to make her (146)-------- to the role a comfortable one.\n\nSincerely,\nAndrei Pronin\nManaging Director";

const laptopNotice =
  "Thank you for your purchase of this S-Tech laptop. Your laptop has been built to the highest standards. In the unlikely event that any defect occurs (147)-------- the two-year warranty period, we will be happy to repair or replace your laptop at no cost to you. Should a defect occur, please (148)-------- your laptop in a box suitable for fragile items and post it to us at the service center address closest to your place of residence. Please ensure that you take out insurance on the package and read the policy details carefully, as we cannot accept responsibility for items lost or damaged while in (149)--------.";

const airportArticle =
  "Pucklebridge Airport, a privately operated airfield previously used only for military and corporate flights, received a $1 million grant this week from the regional government. Henry Diarra, Director of Regional Development, (150)-------- department approved the grant, said that the grant would help the airport's management achieve its ambition of making Pucklebridge a regional aviation hub. (151)--------, Diarra said that the grant would help the wider business community in the area, who will be able to travel far more easily thanks to the airport's (152)--------.\n\nA new runway and a completely revamped passenger terminal will be completed by the end of next year, Diarra added.";

const questions: Question[] = [
  { id: 433, part: 6, set: 2, conversation: welcomeEmail, question: "141. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["In conclusion", "Instead of", "Rather than", "As a result"], answer: "D" },
  { id: 434, part: 6, set: 2, conversation: welcomeEmail, question: "142. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["changed", "changes", "changing", "to change"], answer: "B" },
  { id: 435, part: 6, set: 2, conversation: welcomeEmail, question: "143. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["relevant", "relevancy", "relevantly", "most relevant"], answer: "A" },
  { id: 436, part: 6, set: 2, conversation: promotionMemo, question: "144. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["giving", "taking", "performing", "presuming"], answer: "B" },
  { id: 437, part: 6, set: 2, conversation: promotionMemo, question: "145. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["negotiate", "negotiates", "negotiator", "negotiating"], answer: "D" },
  { id: 438, part: 6, set: 2, conversation: promotionMemo, question: "146. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["proposition", "transition", "revision", "acquisition"], answer: "B" },
  { id: 439, part: 6, set: 2, conversation: laptopNotice, question: "147. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["prior", "until", "before", "during"], answer: "D" },
  { id: 440, part: 6, set: 2, conversation: laptopNotice, question: "148. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["have packaged", "package", "packaging", "be packaging"], answer: "B" },
  { id: 441, part: 6, set: 2, conversation: laptopNotice, question: "149. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["mail", "post", "transit", "travel"], answer: "C" },
  { id: 442, part: 6, set: 2, conversation: airportArticle, question: "150. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["whose", "that", "which", "whom"], answer: "A" },
  { id: 443, part: 6, set: 2, conversation: airportArticle, question: "151. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["Unfortunately", "Randomly", "Similarly", "Additionally"], answer: "D" },
  { id: 444, part: 6, set: 2, conversation: airportArticle, question: "152. 빈칸에 들어갈 가장 알맞은 단어를 고르세요.", options: ["expand", "expanding", "expansion", "had expanded"], answer: "C" },
];

export default questions;
