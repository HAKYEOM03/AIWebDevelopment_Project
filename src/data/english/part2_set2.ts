import { Question } from "./types";

const questions: Question[] = [
  { id: 61, part: 2, set: 2, question: "When is the meeting being held?", options: ["At 10 o'clock tomorrow.", "It was nice meeting you.", "On the sixth floor."], answer: "A" },
  { id: 62, part: 2, set: 2, question: "Can you help me carry these boxes?", options: ["I'm sorry, but I'm in a real hurry.", "These jeans are too tight.", "The carrots are not very fresh."], answer: "A" },
  { id: 63, part: 2, set: 2, question: "Excuse me, where is the nearest subway station?", options: ["The gas station is quite far from here.", "There's one around the corner.", "It closes at midnight."], answer: "B" },
  { id: 64, part: 2, set: 2, question: "Who should I contact to apply for the job?", options: ["Please fill in the application form.", "I don't have a lot of business contacts.", "You should call Gary in Human Resources."], answer: "C" },
  { id: 65, part: 2, set: 2, question: "Is this printer working?", options: ["Yes, please make three copies.", "No, I'm working until seven thirty.", "No, it ran out of toner."], answer: "C" },
  { id: 66, part: 2, set: 2, question: "Why did the New York office move to a new location?", options: ["They needed a bigger office.", "We need more office supplies.", "It is located on 5th Avenue."], answer: "A" },
  { id: 71, part: 2, set: 2, question: "You're flying to Boston on Thursday, aren't you?", options: ["No, I hate flies. They're really annoying.", "Yes, and I will be back in two weeks.", "My birthday is on Thursday, too."], answer: "B" },
  { id: 68, part: 2, set: 2, question: "How long do I have to wait to see the results?", options: ["About a week.", "In the waiting room.", "Around 4 o'clock."], answer: "A" },
  { id: 69, part: 2, set: 2, question: "Are the tickets sold out, or can I still buy one?", options: ["We have some seats left for the Monday show.", "The tickets will cost 200 dollars.", "You can buy a new car as well."], answer: "A" },
  { id: 70, part: 2, set: 2, question: "Would you mind turning off the air conditioning?", options: ["He has made up his mind.", "It was broken yesterday.", "Don't you think it's still hot in here?"], answer: "C" },
  { id: 67, part: 2, set: 2, question: "Where can I get the schedule for the shuttle bus to the airport?", options: ["The bus stops at the main entrance.", "You should go to the information desk.", "My flight departs on Sunday."], answer: "B" },
  { id: 72, part: 2, set: 2, question: "When are you going back to China?", options: ["I like Chinese food, too.", "He has already gone to China.", "On June first."], answer: "C" },
  { id: 73, part: 2, set: 2, question: "Please turn off your computer when you leave.", options: ["Did you turn off your cell phone?", "Don't worry. I won't forget.", "She is on maternity leave."], answer: "B" },
  { id: 74, part: 2, set: 2, question: "Don't you want to go to the party tonight?", options: ["Not really. I'm so tired.", "The party starts at nine.", "It will be held at Lisa's."], answer: "A" },
  { id: 75, part: 2, set: 2, question: "Do we need to confirm the reservation?", options: ["I reserved two seats.", "Yes, I think so.", "What's your confirmation number?"], answer: "B" },
  { id: 76, part: 2, set: 2, question: "Who was hired as the new football coach?", options: ["I'll teach you how to play football.", "It's not decided yet.", "I need a higher education."], answer: "B" },
  { id: 77, part: 2, set: 2, question: "Why are you leaving already?", options: ["I don't want to miss the last train.", "I don't want to leave any food.", "I'm all ready now."], answer: "A" },
  { id: 78, part: 2, set: 2, question: "Would you like to try on this jacket?", options: ["Yes, I'd like to taste the wine.", "Yes, I need a packet of cigarettes.", "OK. Where's the fitting room?"], answer: "C" },
  { id: 79, part: 2, set: 2, question: "We will be able to launch the campaign in two weeks.", options: ["Can we do it any sooner?", "OK, let's have lunch together then.", "How much is the champagne?"], answer: "A" },
  { id: 80, part: 2, set: 2, question: "When will the road work start on Nelson Street?", options: ["He didn't start working yet.", "The road will be paved again.", "Sometime next week."], answer: "C" },
  { id: 81, part: 2, set: 2, question: "Which brochure design do you prefer?", options: ["I think this one is more appealing.", "I'll make sure it doesn't happen again.", "I prefer to drive to work."], answer: "A" },
  { id: 82, part: 2, set: 2, question: "How do we install this new software?", options: ["A tall guy came to fix the copier.", "Just insert the CD and it will start automatically.", "This is the most popular software."], answer: "B" },
  { id: 83, part: 2, set: 2, question: "Would you rather wait here or come back later?", options: ["You are on the waiting list.", "He will call you back later.", "Well, I have plenty of time today."], answer: "C" },
  { id: 84, part: 2, set: 2, question: "Why don't we check out our budget before making a decision?", options: ["I think that's a good idea.", "The check-out time is 11 o'clock.", "We decided to support Mr. Kim."], answer: "A" },
  { id: 85, part: 2, set: 2, question: "Shouldn't these documents be classified confidential?", options: ["The class will start next Tuesday.", "No, it's not necessary.", "We need more paper to print out the documents."], answer: "B" },
  { id: 86, part: 2, set: 2, question: "Where should I go to submit these forms?", options: ["You need to come to work by eight thirty.", "The storms are approaching.", "You need to go to the third floor."], answer: "C" },
  { id: 87, part: 2, set: 2, question: "It's hot in the meeting room, isn't it?", options: ["I'll be in a meeting in five minutes.", "I'll turn on the air conditioning.", "You're right. It's not so hot."], answer: "B" },
  { id: 88, part: 2, set: 2, question: "Should I e-mail this notice to the entire staff?", options: ["I didn't get the e-mail from our CEO yet.", "Yes, the event was very tiring.", "Yes, everyone needs to know about this."], answer: "C" },
  { id: 89, part: 2, set: 2, question: "I think my cell phone ran out of battery.", options: ["You can sell it at a better price.", "He is out of town on business.", "Well, you can use mine then."], answer: "C" },
  { id: 90, part: 2, set: 2, question: "What do you think we should name our new product?", options: ["Something fun and catchy.", "Our new products will be in stores from next month.", "His name is Jack Richardson."], answer: "A" }
];

export default questions;
