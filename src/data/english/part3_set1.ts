import { Question } from "./types";

const questions: Question[] = [
  // Q41-43
  {
    id: 121,
    part: 3,
    set: 1,
    conversation: "W: Reception. How can I help you?\nM: This is Andrew Valencia from room 201. I ordered a salmon salad from your restaurant and would like to return the dish. The salmon seems not fresh. It smells weird.\nW: Oh, I'm very sorry. Let me call them right away and ask them to bring you a replacement soon.\nM: Actually, I don't want to try the same dish again. Can you give me a few minutes to have a look at the menu?",
    question: "Where does the conversation take place?",
    options: ["In a restaurant", "In a hotel", "In a grocery store", "At a café"],
    answer: "B"
  },
  {
    id: 122,
    part: 3,
    set: 1,
    conversation: "W: Reception. How can I help you?\nM: This is Andrew Valencia from room 201. I ordered a salmon salad from your restaurant and would like to return the dish. The salmon seems not fresh. It smells weird.\nW: Oh, I'm very sorry. Let me call them right away and ask them to bring you a replacement soon.\nM: Actually, I don't want to try the same dish again. Can you give me a few minutes to have a look at the menu?",
    question: "Why is the man complaining?",
    options: ["The food is not good.", "He did not get a receipt.", "He was served the wrong dish.", "The bill is higher than he expected."],
    answer: "A"
  },
  {
    id: 123,
    part: 3,
    set: 1,
    conversation: "W: Reception. How can I help you?\nM: This is Andrew Valencia from room 201. I ordered a salmon salad from your restaurant and would like to return the dish. The salmon seems not fresh. It smells weird.\nW: Oh, I'm very sorry. Let me call them right away and ask them to bring you a replacement soon.\nM: Actually, I don't want to try the same dish again. Can you give me a few minutes to have a look at the menu?",
    question: "What does the woman suggest the man do?",
    options: ["Ask for a refill service", "Talk to the manager", "Wait for the replacement", "Check the menu"],
    answer: "D"
  },

  // Q44-46
  {
    id: 124,
    part: 3,
    set: 1,
    conversation: "M: Hello, I have a ticket for the flight to London at 3:00 P.M. but I just missed the flight. When is the next flight available?\nW: Let me check... Hmm, there is a flight leaving at 7:00 P.M. today but it's fully booked. The one after that is at 9:00 A.M. tomorrow morning. There are a few seats left.\nM: Oh, no. I have an important business meeting at 10:00 A.M. tomorrow. If I take that flight, I will definitely be late. Is there any other way?\nW: Well, you can take a flight to Paris at 8:00 P.M. tonight and then take a train to London from there. That way, you'll arrive in London by 7:00 A.M. tomorrow.",
    question: "What is the man's problem?",
    options: ["He missed his flight.", "He lost his ticket.", "He is late for a meeting.", "He forgot his passport."],
    answer: "A"
  },
  {
    id: 125,
    part: 3,
    set: 1,
    conversation: "M: Hello, I have a ticket for the flight to London at 3:00 P.M. but I just missed the flight. When is the next flight available?\nW: Let me check... Hmm, there is a flight leaving at 7:00 P.M. today but it's fully booked. The one after that is at 9:00 A.M. tomorrow morning. There are a few seats left.\nM: Oh, no. I have an important business meeting at 10:00 A.M. tomorrow. If I take that flight, I will definitely be late. Is there any other way?\nW: Well, you can take a flight to Paris at 8:00 P.M. tonight and then take a train to London from there. That way, you'll arrive in London by 7:00 A.M. tomorrow.",
    question: "Why does the man reject the next direct flight to London?",
    options: ["It is too expensive.", "It is fully booked.", "It arrives too late.", "It is canceled due to weather."],
    answer: "C"
  },
  {
    id: 126,
    part: 3,
    set: 1,
    conversation: "M: Hello, I have a ticket for the flight to London at 3:00 P.M. but I just missed the flight. When is the next flight available?\nW: Let me check... Hmm, there is a flight leaving at 7:00 P.M. today but it's fully booked. The one after that is at 9:00 A.M. tomorrow morning. There are a few seats left.\nM: Oh, no. I have an important business meeting at 10:00 A.M. tomorrow. If I take that flight, I will definitely be late. Is there any other way?\nW: Well, you can take a flight to Paris at 8:00 P.M. tonight and then take a train to London from there. That way, you'll arrive in London by 7:00 A.M. tomorrow.",
    question: "What does the woman suggest the man do?",
    options: ["Cancel his business meeting", "Travel through another city", "Stay at a hotel near the airport", "Rent a car to drive to London"],
    answer: "B"
  },

  // Q47-49
  {
    id: 127,
    part: 3,
    set: 1,
    conversation: "W: Good morning. This is Elite Limousine Service. How can I help you?\nM: Hello, I'd like to reserve a limousine for tomorrow evening. My company is hosting a VIP dinner and we need to pick up a client from the airport.\nW: Certainly. We have several types of vehicles available. For a VIP client, I highly recommend our luxury sedan or a stretch limousine. Do you have a preference?\nM: A luxury sedan would be perfect. Also, could you make sure the driver speaks fluent Japanese? Our client is from Tokyo and doesn't speak much English.",
    question: "What is the purpose of the man's call?",
    options: ["To book a restaurant for a dinner", "To arrange transportation for a client", "To apply for a job as a driver", "To complain about a late service"],
    answer: "B"
  },
  {
    id: 128,
    part: 3,
    set: 1,
    conversation: "W: Good morning. This is Elite Limousine Service. How can I help you?\nM: Hello, I'd like to reserve a limousine for tomorrow evening. My company is hosting a VIP dinner and we need to pick up a client from the airport.\nW: Certainly. We have several types of vehicles available. For a VIP client, I highly recommend our luxury sedan or a stretch limousine. Do you have a preference?\nM: A luxury sedan would be perfect. Also, could you make sure the driver speaks fluent Japanese? Our client is from Tokyo and doesn't speak much English.",
    question: "What vehicle does the man choose?",
    options: ["A stretch limousine", "A luxury sedan", "A passenger van", "An SUV"],
    answer: "B"
  },
  {
    id: 129,
    part: 3,
    set: 1,
    conversation: "W: Good morning. This is Elite Limousine Service. How can I help you?\nM: Hello, I'd like to reserve a limousine for tomorrow evening. My company is hosting a VIP dinner and we need to pick up a client from the airport.\nW: Certainly. We have several types of vehicles available. For a VIP client, I highly recommend our luxury sedan or a stretch limousine. Do you have a preference?\nM: A luxury sedan would be perfect. Also, could you make sure the driver speaks fluent Japanese? Our client is from Tokyo and doesn't speak much English.",
    question: "What special request does the man make?",
    options: ["The driver must arrive early.", "The vehicle must be black.", "The driver should speak Japanese.", "The ride must include free drinks."],
    answer: "C"
  },

  // Q50-52
  {
    id: 130,
    part: 3,
    set: 1,
    conversation: "M: Sarah, how is the preparation for the charity fundraiser going? Have we raised enough money for the hurricane victims yet?\nW: We're making good progress, Mark. So far, we've collected around $15,000 through online donations, but our goal is $20,000 by the end of this week.\nM: That's great to hear. I think we can easily reach the goal if we promote the event on social media a bit more heavily. I can create a promotional video tonight if you want.\nW: Oh, that would be wonderful! A video would definitely attract more donors. Let's upload it tomorrow morning.",
    question: "What are the speakers organizing?",
    options: ["A corporate business meeting", "A charity fundraiser", "A social media training workshop", "A hurricane safety seminar"],
    answer: "B"
  },
  {
    id: 131,
    part: 3,
    set: 1,
    conversation: "M: Sarah, how is the preparation for the charity fundraiser going? Have we raised enough money for the hurricane victims yet?\nW: We're making good progress, Mark. So far, we've collected around $15,000 through online donations, but our goal is $20,000 by the end of this week.\nM: That's great to hear. I think we can easily reach the goal if we promote the event on social media a bit more heavily. I can create a promotional video tonight if you want.\nW: Oh, that would be wonderful! A video would definitely attract more donors. Let's upload it tomorrow morning.",
    question: "What is the financial goal of the event?",
    options: ["$5,000", "$15,000", "$20,000", "$35,000"],
    answer: "C"
  },
  {
    id: 132,
    part: 3,
    set: 1,
    conversation: "M: Sarah, how is the preparation for the charity fundraiser going? Have we raised enough money for the hurricane victims yet?\nW: We're making good progress, Mark. So far, we've collected around $15,000 through online donations, but our goal is $20,000 by the end of this week.\nM: That's great to hear. I think we can easily reach the goal if we promote the event on social media a bit more heavily. I can create a promotional video tonight if you want.\nW: Oh, that would be wonderful! A video would definitely attract more donors. Let's upload it tomorrow morning.",
    question: "What does the man offer to do tonight?",
    options: ["Donate some money online", "Create a promotional video", "Contact local businesses", "Design a physical poster"],
    answer: "B"
  },

  // Q53-55
  {
    id: 133,
    part: 3,
    set: 1,
    conversation: "W: Excuse me, I'm trying to find the modern art exhibition that opened this week. Could you tell me where it is located?\nM: Yes, it's on the third floor in Gallery B. However, please note that you need a special ticket for that specific exhibition. The general admission ticket doesn't cover it.\nW: Oh, I see. I only bought the general ticket at the entrance. Where can I upgrade my ticket?\nM: You don't have to go all the way back down to the main lobby. There is a ticket desk right next to the elevator on the third floor where you can pay the difference.",
    question: "What is the woman looking for?",
    options: ["A modern art exhibition", "The history museum entrance", "An elevator to the basement", "The museum gift shop"],
    answer: "A"
  },
  {
    id: 134,
    part: 3,
    set: 1,
    conversation: "W: Excuse me, I'm trying to find the modern art exhibition that opened this week. Could you tell me where it is located?\nM: Yes, it's on the third floor in Gallery B. However, please note that you need a special ticket for that specific exhibition. The general admission ticket doesn't cover it.\nW: Oh, I see. I only bought the general ticket at the entrance. Where can I upgrade my ticket?\nM: You don't have to go all the way back down to the main lobby. There is a ticket desk right next to the elevator on the third floor where you can pay the difference.",
    question: "What problem does the man point out?",
    options: ["The exhibition is currently closed.", "The third floor is under construction.", "The woman's ticket is not sufficient.", "The elevator is out of order."],
    answer: "C"
  },
  {
    id: 135,
    part: 3,
    set: 1,
    conversation: "W: Excuse me, I'm trying to find the modern art exhibition that opened this week. Could you tell me where it is located?\nM: Yes, it's on the third floor in Gallery B. However, please note that you need a special ticket for that specific exhibition. The general admission ticket doesn't cover it.\nW: Oh, I see. I only bought the general ticket at the entrance. Where can I upgrade my ticket?\nM: You don't have to go all the way back down to the main lobby. There is a ticket desk right next to the elevator on the third floor where you can pay the difference.",
    question: "Where can the woman upgrade her ticket?",
    options: ["At the main entrance lobby", "Near the third-floor elevator", "Inside Gallery B", "Online via her phone"],
    answer: "B"
  },

  // Q56-58
  {
    id: 136,
    part: 3,
    set: 1,
    conversation: "M: Hi, Julia. Did you receive the new laptop from the IT department? I heard everyone in marketing is getting an upgrade this week.\nW: Not yet, David. I checked with the IT manager this morning, and he said my laptop is still being configured with the required software. It should be ready by Thursday.\nM: That's great. The new models are much faster and lighter. By the way, remember that we have to return our old laptops along with all the chargers and cables.\nW: Good to know. I'll make sure to pack everything into my laptop bag tonight so I don't forget any cords.",
    question: "What department do the speakers most likely work in?",
    options: ["Information Technology", "Human Resources", "Marketing", "Accounting"],
    answer: "C"
  },
  {
    id: 137,
    part: 3,
    set: 1,
    conversation: "M: Hi, Julia. Did you receive the new laptop from the IT department? I heard everyone in marketing is getting an upgrade this week.\nW: Not yet, David. I checked with the IT manager this morning, and he said my laptop is still being configured with the required software. It should be ready by Thursday.\nM: That's great. The new models are much faster and lighter. By the way, remember that we have to return our old laptops along with all the chargers and cables.\nW: Good to know. I'll make sure to pack everything into my laptop bag tonight so I don't forget any cords.",
    question: "When will Julia's new laptop be ready?",
    options: ["Today", "Tomorrow", "On Thursday", "Next Monday"],
    answer: "C"
  },
  {
    id: 138,
    part: 3,
    set: 1,
    conversation: "M: Hi, Julia. Did you receive the new laptop from the IT department? I heard everyone in marketing is getting an upgrade this week.\nW: Not yet, David. I checked with the IT manager this morning, and he said my laptop is still being configured with the required software. It should be ready by Thursday.\nM: That's great. The new models are much faster and lighter. By the way, remember that we have to return our old laptops along with all the chargers and cables.\nW: Good to know. I'll make sure to pack everything into my laptop bag tonight so I don't forget any cords.",
    question: "What are the employees required to return?",
    options: ["Old laptops and accessories", "Their employee ID badges", "Software installation discs", "Signed security agreements"],
    answer: "A"
  },

  // Q59-61
  {
    id: 139,
    part: 3,
    set: 1,
    conversation: "W: Hello, Mr. Thompson. This is Dr. Green's office calling to confirm your dental checkup scheduled for Friday at 2:00 P.M.\nM: Oh, hello. I was actually just about to call you. Something came up at work, and I won't be able to make it at that time. Can we reschedule it to next week?\nW: Let's see... Dr. Green has an opening next Tuesday, October 14th, at 10:00 A.M. or Wednesday afternoon at 4:00 P.M. Would either of those work for you?\nM: Tuesday morning at 10:00 A.M. works perfectly for me. Please put me down for that slot.",
    question: "Why is the man unable to keep his original appointment?",
    options: ["He is going on a vacation.", "He has a conflict at work.", "He is feeling unwell.", "He forgot the schedule."],
    answer: "B"
  },
  {
    id: 140,
    part: 3,
    set: 1,
    conversation: "W: Hello, Mr. Thompson. This is Dr. Green's office calling to confirm your dental checkup scheduled for Friday at 2:00 P.M.\nM: Oh, hello. I was actually just about to call you. Something came up at work, and I won't be able to make it at that time. Can we reschedule it to next week?\nW: Let's see... Dr. Green has an opening next Tuesday, October 14th, at 10:00 A.M. or Wednesday afternoon at 4:00 P.M. Would either of those work for you?\nM: Tuesday morning at 10:00 A.M. works perfectly for me. Please put me down for that slot.",
    question: "When is the new appointment scheduled for?",
    options: ["Friday at 2:00 P.M.", "Next Tuesday at 10:00 A.M.", "Next Wednesday at 4:00 P.M.", "Next Friday at 10:00 A.M."],
    answer: "B"
  },
  {
    id: 141,
    part: 3,
    set: 1,
    conversation: "W: Hello, Mr. Thompson. This is Dr. Green's office calling to confirm your dental checkup scheduled for Friday at 2:00 P.M.\nM: Oh, hello. I was actually just about to call you. Something came up at work, and I won't be able to make it at that time. Can we reschedule it to next week?\nW: Let's see... Dr. Green has an opening next Tuesday, October 14th, at 10:00 A.M. or Wednesday afternoon at 4:00 P.M. Would either of those work for you?\nM: Tuesday morning at 10:00 A.M. works perfectly for me. Please put me down for that slot.",
    question: "What kind of office is calling the man?",
    options: ["A law firm", "A dental clinic", "A car repair shop", "An insurance agency"],
    answer: "B"
  },

  // Q62-64
  {
    id: 142,
    part: 3,
    set: 1,
    conversation: "M: Hi, Lisa. I'm planning a hiking trip to Echo Mountain this Saturday. Since you went there last month, do you have any tips for me?\nW: It's a beautiful trail, but it's very steep and rocky. You should definitely wear sturdy hiking boots. Also, there are no water stations along the path, so bring plenty of water.\nM: Thanks for the advice. I'll make sure to pack extra water bottles. Is the trail easy to follow, or should I buy a physical map?\nW: The trail is very well marked with signs, so you won't get lost. But it's a good idea to download an offline map on your phone just in case.",
    question: "Where is the man planning to go this Saturday?",
    options: ["To a local beach", "To a national park trail", "To a modern fitness center", "To an indoor rock climbing gym"],
    answer: "B"
  },
  {
    id: 143,
    part: 3,
    set: 1,
    conversation: "M: Hi, Lisa. I'm planning a hiking trip to Echo Mountain this Saturday. Since you went there last month, do you have any tips for me?\nW: It's a beautiful trail, but it's very steep and rocky. You should definitely wear sturdy hiking boots. Also, there are no water stations along the path, so bring plenty of water.\nM: Thanks for the advice. I'll make sure to pack extra water bottles. Is the trail easy to follow, or should I buy a physical map?\nW: The trail is very well marked with signs, so you won't get lost. But it's a good idea to download an offline map on your phone just in case.",
    question: "What safety item or gear does the woman emphasize?",
    options: ["A heavy raincoat", "Sturdy hiking boots", "A safety helmet", "A compass"],
    answer: "B"
  },
  {
    id: 144,
    part: 3,
    set: 1,
    conversation: "M: Hi, Lisa. I'm planning a hiking trip to Echo Mountain this Saturday. Since you went there last month, do you have any tips for me?\nW: It's a beautiful trail, but it's very steep and rocky. You should definitely wear sturdy hiking boots. Also, there are no water stations along the path, so bring plenty of water.\nM: Thanks for the advice. I'll make sure to pack extra water bottles. Is the trail easy to follow, or should I buy a physical map?\nW: The trail is very well marked with signs, so you won't get lost. But it's a good idea to download an offline map on your phone just in case.",
    question: "What option does the woman recommend for navigation?",
    options: ["Buying a physical map", "Following small rocks", "Downloading an offline map", "Bringing a digital camera"],
    answer: "C"
  },

  // Q65-67
  {
    id: 145,
    part: 3,
    set: 1,
    conversation: "W: Excuse me, I am looking for a gift for my husband's birthday. I saw a nice leather wallet in your catalog, but I can't find it on the shelves.\nM: Let me check our inventory system. Ah, yes, the classic brown leather wallet. We are currently out of stock on the sales floor, but we have two left in the back stockroom.\nW: Oh, that's perfect! Could you please bring one out for me? I'd really appreciate it.\nM: Certainly. It will take just a few minutes. While you wait, would you like to take a look at our matching leather belts? They are currently on sale for 20% off.",
    question: "Who is the woman buying a gift for?",
    options: ["Her son", "Her father", "Her husband", "Her coworker"],
    answer: "C"
  },
  {
    id: 146,
    part: 3,
    set: 1,
    conversation: "W: Excuse me, I am looking for a gift for my husband's birthday. I saw a nice leather wallet in your catalog, but I can't find it on the shelves.\nM: Let me check our inventory system. Ah, yes, the classic brown leather wallet. We are currently out of stock on the sales floor, but we have two left in the back stockroom.\nW: Oh, that's perfect! Could you please bring one out for me? I'd really appreciate it.\nM: Certainly. It will take just a few minutes. While you wait, would you like to take a look at our matching leather belts? They are currently on sale for 20% off.",
    question: "Where is the item located?",
    options: ["On the display shelf", "In the back stockroom", "At another branch store", "Near the cash register"],
    answer: "B"
  },
  {
    id: 147,
    part: 3,
    set: 1,
    conversation: "W: Excuse me, I am looking for a gift for my husband's birthday. I saw a nice leather wallet in your catalog, but I can't find it on the shelves.\nM: Let me check our inventory system. Ah, yes, the classic brown leather wallet. We are currently out of stock on the sales floor, but we have two left in the back stockroom.\nW: Oh, that's perfect! Could you please bring one out for me? I'd really appreciate it.\nM: Certainly. It will take just a few minutes. While you wait, would you like to take a look at our matching leather belts? They are currently on sale for 20% off.",
    question: "What promotional offer does the man mention?",
    options: ["A buy-one-get-one-free deal", "Free gift wrapping service", "A 20% discount on leather belts", "A voucher for the next purchase"],
    answer: "C"
  },

  // Q68-70
  {
    id: 148,
    part: 3,
    set: 1,
    conversation: "M: Christine, I am really impressed. Your proposal to open a branch in Hong Kong looks well researched and planned.\nW: Thanks, John. I really think it's time for our company to enter the Asian market. Do you think we can get a budget that will support an aggressive entry?\nM: Of course! With our success in Toronto and Vancouver, Canada last year, I think the board will be optimistic and eager to take a share of the Asian financial market.\nW: Excellent. There's no reason to let the Chinese banks based on Shanghai take such a large share in Asia.",
    question: "What are the speakers discussing?",
    options: ["A merge with a Chinese bank", "A decrease in the annual budget", "The Asian entertainment industry", "Business expansion"],
    answer: "D"
  },
  {
    id: 149,
    part: 3,
    set: 1,
    conversation: "M: Christine, I am really impressed. Your proposal to open a branch in Hong Kong looks well researched and planned.\nW: Thanks, John. I really think it's time for our company to enter the Asian market. Do you think we can get a budget that will support an aggressive entry?\nM: Of course! With our success in Toronto and Vancouver, Canada last year, I think the board will be optimistic and eager to take a share of the Asian financial market.\nW: Excellent. There's no reason to let the Chinese banks based on Shanghai take such a large share in Asia.",
    question: "What happened to the company last year?",
    options: ["It performed well in Canada.", "It closed a few branches.", "It lost its market share to a competitor.", "It increased its budget for research."],
    answer: "A"
  },
  {
    id: 150,
    part: 3,
    set: 1,
    conversation: "M: Christine, I am really impressed. Your proposal to open a branch in Hong Kong looks well researched and planned.\nW: Thanks, John. I really think it's time for our company to enter the Asian market. Do you think we can get a budget that will support an aggressive entry?\nM: Of course! With our success in Toronto and Vancouver, Canada last year, I think the board will be optimistic and eager to take a share of the Asian financial market.\nW: Excellent. There's no reason to let the Chinese banks based on Shanghai take such a large share in Asia.",
    question: "Where did the company achieve market success last year?",
    options: ["Hong Kong", "Toronto and Vancouver", "Shanghai", "Tokyo"],
    answer: "B"
  }
];

export default questions;
