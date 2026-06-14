import { Question } from "./types";

const questions: Question[] = [
  // Q41-43
  {
    id: 181,
    part: 3,
    set: 3,
    conversation: "M: Did the maintenance company come to fix the refrigerator in the storage room?\nW: Not yet, We are still keeping all of the beverages in the salad preparation refrigerator.\nM: Has anyone called them again to see if they are coming? We need it working before the dinner shift starts.\nW: Not today. Yesterday they said someone would be here by 3 P.M. today. It's 5 now. I'd better contact them now.",
    question: "Where does the conversation take place?",
    options: ["In a meeting room", "In an appliance store", "In a restaurant", "In an office"],
    answer: "C"
  },
  {
    id: 182,
    part: 3,
    set: 3,
    conversation: "M: Did the maintenance company come to fix the refrigerator in the storage room?\nW: Not yet, We are still keeping all of the beverages in the salad preparation refrigerator.\nM: Has anyone called them again to see if they are coming? We need it working before the dinner shift starts.\nW: Not today. Yesterday they said someone would be here by 3 P.M. today. It's 5 now. I'd better contact them now.",
    question: "Who are the workers waiting for?",
    options: ["A job applicant", "An important client", "An office manager", "A repair person"],
    answer: "D"
  },
  {
    id: 183,
    part: 3,
    set: 3,
    conversation: "M: Did the maintenance company come to fix the refrigerator in the storage room?\nW: Not yet, We are still keeping all of the beverages in the salad preparation refrigerator.\nM: Has anyone called them again to see if they are coming? We need it working before the dinner shift starts.\nW: Not today. Yesterday they said someone would be here by 3 P.M. today. It's 5 now. I'd better contact them now.",
    question: "What will the woman probably do next?",
    options: ["Schedule a seminar", "Call the maintenance company", "Talk with new employees", "Purchase some home appliances"],
    answer: "B"
  },

  // Q44-46
  {
    id: 184,
    part: 3,
    set: 3,
    conversation: "W: Jeremy, were you able to find a parking spot? It's not that easy to get a safe parking space near here.\nM: Yes, I parked about two blocks away under the bridge near the construction zone.\nW: I don't think you should leave your car there. I know that a few people had their cars broken into and items stolen there recently. You should move it to the garage opposite the station.\nM: Oh, really? Thanks for telling me. I'll go and move it right now. Could you tell the team to start the meeting without me?",
    question: "What concern does the woman raise?",
    options: ["Parking safety", "A traffic jam", "Construction noise", "A delayed train"],
    answer: "A"
  },
  {
    id: 185,
    part: 3,
    set: 3,
    conversation: "W: Jeremy, were you able to find a parking spot? It's not that easy to get a safe parking space near here.\nM: Yes, I parked about two blocks away under the bridge near the construction zone.\nW: I don't think you should leave your car there. I know that a few people had their cars broken into and items stolen there recently. You should move it to the garage opposite the station.\nM: Oh, really? Thanks for telling me. I'll go and move it right now. Could you tell the team to start the meeting without me?",
    question: "What happened to some people recently near the bridge?",
    options: ["They got lost on the road.", "Their cars were towed away.", "They lost items from their cars.", "They were fine for speeding."],
    answer: "C"
  },
  {
    id: 186,
    part: 3,
    set: 3,
    conversation: "W: Jeremy, were you able to find a parking spot? It's not that easy to get a safe parking space near here.\nM: Yes, I parked about two blocks away under the bridge near the construction zone.\nW: I don't think you should leave your car there. I know that a few people had their cars broken into and items stolen there recently. You should move it to the garage opposite the station.\nM: Oh, really? Thanks for telling me. I'll go and move it right now. Could you tell the team to start the meeting without me?",
    question: "What does the man imply when he asks the woman to tell the team?",
    options: ["He wants a new parking permit.", "He wants to cancel the conference.", "He wants to invite more people.", "He wants them to start the meeting without him."],
    answer: "D"
  },

  // Q47-49
  {
    id: 187,
    part: 3,
    set: 3,
    conversation: "M: Hi, Sandra. Did you hear about the restructuring at the Dallas headquarters? Some departments are being combined.\nW: Yes, I did. My supervisor told me that our marketing team will be merged with the public relations team starting next quarter.\nM: That's a big change. Will anyone have to relocate to Dallas from our branch?\nW: No, thankfully we can all stay here, but we will have a new department manager who is transferring from the main office.",
    question: "What are the speakers discussing?",
    options: ["A company merger with a competitor", "Organizational restructuring at headquarters", "A marketing budget adjustment", "The opening of a new branch office"],
    answer: "B"
  },
  {
    id: 188,
    part: 3,
    set: 3,
    conversation: "M: Hi, Sandra. Did you hear about the restructuring at the Dallas headquarters? Some departments are being combined.\nW: Yes, I did. My supervisor told me that our marketing team will be merged with the public relations team starting next quarter.\nM: That's a big change. Will anyone have to relocate to Dallas from our branch?\nW: No, thankfully we can all stay here, but we will have a new department manager who is transferring from the main office.",
    question: "Which departments are being merged?",
    options: ["Sales and Accounting", "Marketing and Public Relations", "Human Resources and Legal", "IT and Customer Service"],
    answer: "B"
  },
  {
    id: 189,
    part: 3,
    set: 3,
    conversation: "M: Hi, Sandra. Did you hear about the restructuring at the Dallas headquarters? Some departments are being combined.\nW: Yes, I did. My supervisor told me that our marketing team will be merged with the public relations team starting next quarter.\nM: That's a big change. Will anyone have to relocate to Dallas from our branch?\nW: No, thankfully we can all stay here, but we will have a new department manager who is transferring from the main office.",
    question: "What change will affect the speakers' branch?",
    options: ["They must relocate to Dallas.", "They will receive a pay raise.", "A new manager will transfer in.", "The branch will close down."],
    answer: "C"
  },

  // Q50-52
  {
    id: 190,
    part: 3,
    set: 3,
    conversation: "W: Hello, this is building management. I'm calling to inform you that a plumber will be coming to your apartment tomorrow morning to fix the hot water heater.\nM: Oh, thanks for letting me know. Will I need to be at home to let them in? I have a full shift at the hospital tomorrow.\nW: No, you don't need to stay. With your permission, our maintenance supervisor can use the master key to accompany the plumber.\nM: That would be great. Please go ahead and do that. I'll make sure to leave the utility closet clear.",
    question: "Why is a plumber visiting the apartment?",
    options: ["To install a new sink", "To fix a hot water heater", "To check the gas pipeline", "To clean the air filters"],
    answer: "B"
  },
  {
    id: 191,
    part: 3,
    set: 3,
    conversation: "W: Hello, this is building management. I'm calling to inform you that a plumber will be coming to your apartment tomorrow morning to fix the hot water heater.\nM: Oh, thanks for letting me know. Will I need to be at home to let them in? I have a full shift at the hospital tomorrow.\nW: No, you don't need to stay. With your permission, our maintenance supervisor can use the master key to accompany the plumber.\nM: That would be great. Please go ahead and do that. I'll make sure to leave the utility closet clear.",
    question: "Where does the man most likely work?",
    options: ["At a plumbing firm", "At a hospital", "In a real estate office", "In a repair shop"],
    answer: "B"
  },
  {
    id: 192,
    part: 3,
    set: 3,
    conversation: "W: Hello, this is building management. I'm calling to inform you that a plumber will be coming to your apartment tomorrow morning to fix the hot water heater.\nM: Oh, thanks for letting me know. Will I need to be at home to let them in? I have a full shift at the hospital tomorrow.\nW: No, you don't need to stay. With your permission, our maintenance supervisor can use the master key to accompany the plumber.\nM: That would be great. Please go ahead and do that. I'll make sure to leave the utility closet clear.",
    question: "How will the plumber access the apartment?",
    options: ["The man will wait at home.", "Using a master key with a supervisor.", "The neighbor will open it.", "The front window is left open."],
    answer: "B"
  },

  // Q53-55
  {
    id: 193,
    part: 3,
    set: 3,
    conversation: "M: Hi, Karen. Have you reviewed the final design layout for the new catalog? The printing company needs our file by Friday afternoon.\nW: I looked at it yesterday, and I think the product images on page 5 are a bit blurry. We should use higher-resolution files.\nM: Good catch. I'll email the photographer right away and ask for the original raw images. Do you think he can send them today?\nW: He's usually very responsive. While you do that, I'll double-check the pricing descriptions on the back page to ensure there are no typos.",
    question: "What project are the speakers working on?",
    options: ["A product website", "A new marketing catalog", "A photography book", "A promotional poster"],
    answer: "B"
  },
  {
    id: 194,
    part: 3,
    set: 3,
    conversation: "M: Hi, Karen. Have you reviewed the final design layout for the new catalog? The printing company needs our file by Friday afternoon.\nW: I looked at it yesterday, and I think the product images on page 5 are a bit blurry. We should use higher-resolution files.\nM: Good catch. I'll email the photographer right away and ask for the original raw images. Do you think he can send them today?\nW: He's usually very responsive. While you do that, I'll double-check the pricing descriptions on the back page to ensure there are no typos.",
    question: "What issue does Karen find on page 5?",
    options: ["A pricing mistake", "Blurry product images", "A missing logo", "Wrong font style"],
    answer: "B"
  },
  {
    id: 195,
    part: 3,
    set: 3,
    conversation: "M: Hi, Karen. Have you reviewed the final design layout for the new catalog? The printing company needs our file by Friday afternoon.\nW: I looked at it yesterday, and I think the product images on page 5 are a bit blurry. We should use higher-resolution files.\nM: Good catch. I'll email the photographer right away and ask for the original raw images. Do you think he can send them today?\nW: He's usually very responsive. While you do that, I'll double-check the pricing descriptions on the back page to ensure there are no typos.",
    question: "What does Karen promise to do next?",
    options: ["Contact the printing company", "Check pricing descriptions for typos", "Call the photographer", "Redesign the layout completely"],
    answer: "B"
  },

  // Q56-58
  {
    id: 196,
    part: 3,
    set: 3,
    conversation: "W: Good afternoon. I purchased this leather handbag online last week, but when it arrived, I noticed that the shoulder strap was completely missing.\nM: Oh, I'm terribly sorry about that mistake, ma'am. We can ship the missing shoulder strap to you free of charge right away.\nW: That would be nice, but I'm traveling abroad this Friday, so it won't arrive in time. Can I exchange it at a physical store instead?\nM: Yes, certainly. You can visit our downtown retail location. Just show your online order confirmation to the clerk at the counter.",
    question: "What is wrong with the customer's purchase?",
    options: ["The color is incorrect.", "The leather is scratched.", "The shoulder strap is missing.", "The zipper is broken."],
    answer: "C"
  },
  {
    id: 197,
    part: 3,
    set: 3,
    conversation: "W: Good afternoon. I purchased this leather handbag online last week, but when it arrived, I noticed that the shoulder strap was completely missing.\nM: Oh, I'm terribly sorry about that mistake, ma'am. We can ship the missing shoulder strap to you free of charge right away.\nW: That would be nice, but I'm traveling abroad this Friday, so it won't arrive in time. Can I exchange it at a physical store instead?\nM: Yes, certainly. You can visit our downtown retail location. Just show your online order confirmation to the clerk at the counter.",
    question: "Why does the woman reject the delivery option?",
    options: ["She is moving to another city.", "She is traveling abroad this Friday.", "The shipping fee is too high.", "She doesn't trust the courier."],
    answer: "B"
  },
  {
    id: 198,
    part: 3,
    set: 3,
    conversation: "W: Good afternoon. I purchased this leather handbag online last week, but when it arrived, I noticed that the shoulder strap was completely missing.\nM: Oh, I'm terribly sorry about that mistake, ma'am. We can ship the missing shoulder strap to you free of charge right away.\nW: That would be nice, but I'm traveling abroad this Friday, so it won't arrive in time. Can I exchange it at a physical store instead?\nM: Yes, certainly. You can visit our downtown retail location. Just show your online order confirmation to the clerk at the counter.",
    question: "What is the woman instructed to show at the store?",
    options: ["A physical warranty receipt", "Her online order confirmation", "Her passport or ID", "A credit card statement"],
    answer: "B"
  },

  // Q59-61
  {
    id: 199,
    part: 3,
    set: 3,
    conversation: "M: Hi, Emily. Are you ready for the software transition tomorrow? Our old accounting system will become read-only at midnight.\nW: I've migrated most of our active accounts, but I'm stuck on the overseas vendor files. The data formatting is slightly different.\nM: Ah, yes. The new software requires currency codes to be explicitly stated. I had the same issue yesterday with the European data.\nW: Oh, that makes sense! Could you show me how to batch-update those fields after lunch? It would save me a lot of manual data entry.",
    question: "What system change is happening tomorrow?",
    options: ["An office security system upgrade", "An accounting software transition", "A hardware server replacement", "A network firewall update"],
    answer: "B"
  },
  {
    id: 200,
    part: 3,
    set: 3,
    conversation: "M: Hi, Emily. Are you ready for the software transition tomorrow? Our old accounting system will become read-only at midnight.\nW: I've migrated most of our active accounts, but I'm stuck on the overseas vendor files. The data formatting is slightly different.\nM: Ah, yes. The new software requires currency codes to be explicitly stated. I had the same issue yesterday with the European data.\nW: Oh, that makes sense! Could you show me how to batch-update those fields after lunch? It would save me a lot of manual data entry.",
    question: "What formatting requirement is missing from Emily's files?",
    options: ["Tax identification numbers", "Explicit currency codes", "Vendor postal codes", "Invoice approval signatures"],
    answer: "B"
  },
  {
    id: 201,
    part: 3,
    set: 3,
    conversation: "M: Hi, Emily. Are you ready for the software transition tomorrow? Our old accounting system will become read-only at midnight.\nW: I've migrated most of our active accounts, but I'm stuck on the overseas vendor files. The data formatting is slightly different.\nM: Ah, yes. The new software requires currency codes to be explicitly stated. I had the same issue yesterday with the European data.\nW: Oh, that makes sense! Could you show me how to batch-update those fields after lunch? It would save me a lot of manual data entry.",
    question: "What does Emily ask the man to do after lunch?",
    options: ["Call the overseas vendors", "Show her how to batch-update fields", "Approve the budget migration", "Contact technical support"],
    answer: "B"
  },

  // Q62-64
  {
    id: 202,
    part: 3,
    set: 3,
    conversation: "W: Good morning, I'm calling from corporate security. Your vehicle's lights are on in the west parking lot. License plate number ABC-123.\nM: Oh, thank you so much for notifying me! I must have forgotten to turn them off in the heavy rain storm this morning.\nW: No problem. Just a reminder that the west lot will close at 6 P.M. today for maintenance, so you'll need to move your car before then.\nM: Got it. I'll go down right now to turn off the lights and move my vehicle over to the south parking structure.",
    question: "Why is corporate security calling the man?",
    options: ["His car is blocking an emergency exit.", "His vehicle's lights are left on.", "He parked in a reserved executive spot.", "His car alarm is going off."],
    answer: "B"
  },
  {
    id: 203,
    part: 3,
    set: 3,
    conversation: "W: Good morning, I'm calling from corporate security. Your vehicle's lights are on in the west parking lot. License plate number ABC-123.\nM: Oh, thank you so much for notifying me! I must have forgotten to turn them off in the heavy rain storm this morning.\nW: No problem. Just a reminder that the west lot will close at 6 P.M. today for maintenance, so you'll need to move your car before then.\nM: Got it. I'll go down right now to turn off the lights and move my vehicle over to the south parking structure.",
    question: "Why will the west parking lot close early today?",
    options: ["Due to a severe weather storm", "For scheduled maintenance work", "To host a company outdoor event", "For security renovations"],
    answer: "B"
  },
  {
    id: 204,
    part: 3,
    set: 3,
    conversation: "W: Good morning, I'm calling from corporate security. Your vehicle's lights are on in the west parking lot. License plate number ABC-123.\nM: Oh, thank you so much for notifying me! I must have forgotten to turn them off in the heavy rain storm this morning.\nW: No problem. Just a reminder that the west lot will close at 6 P.M. today for maintenance, so you'll need to move your car before then.\nM: Got it. I'll go down right now to turn off the lights and move my vehicle over to the south parking structure.",
    question: "Where will the man park his vehicle next?",
    options: ["In the north parking zone", "Under the bridge structure", "In the south parking structure", "At a public lot down the street"],
    answer: "C"
  },

  // Q65-67
  {
    id: 205,
    part: 3,
    set: 3,
    conversation: "W: Hi, I'm traveling with my son who is 12 years old. He needs to fly alone to Chicago to visit his grandparents. Does your airline provide an escort service?\nM: We always have our escorts come here, so passengers get to the correct gate on time. Do you have any bags to check?\nW: Yes, he has one suitcase that needs to go in the cargo hold. I've already paid the service fee for unaccompanied minors online.\nM: Perfect. Let me print his special gate pass and baggage tag. You'll be able to accompany him through security up to the gate departure lounge.",
    question: "Where most likely are the speakers?",
    options: ["In a hotel lobby", "In a bank", "In an airport", "In a train station"],
    answer: "C"
  },
  {
    id: 206,
    part: 3,
    set: 3,
    conversation: "W: Hi, I'm traveling with my son who is 12 years old. He needs to fly alone to Chicago to visit his grandparents. Does your airline provide an escort service?\nM: We always have our escorts come here, so passengers get to the correct gate on time. Do you have any bags to check?\nW: Yes, he has one suitcase that needs to go in the cargo hold. I've already paid the service fee for unaccompanied minors online.\nM: Perfect. Let me print his special gate pass and baggage tag. You'll be able to accompany him through security up to the gate departure lounge.",
    question: "Why does the woman's son need an escort?",
    options: ["He is underage.", "He is very sick.", "He has a lot of money.", "He has too many bags."],
    answer: "A"
  },
  {
    id: 207,
    part: 3,
    set: 3,
    conversation: "W: Hi, I'm traveling with my son who is 12 years old. He needs to fly alone to Chicago to visit his grandparents. Does your airline provide an escort service?\nM: We always have our escorts come here, so passengers get to the correct gate on time. Do you have any bags to check?\nW: Yes, he has one suitcase that needs to go in the cargo hold. I've already paid the service fee for unaccompanied minors online.\nM: Perfect. Let me print his special gate pass and baggage tag. You'll be able to accompany him through security up to the gate departure lounge.",
    question: "What will the woman probably do next?",
    options: ["Check a train schedule", "Give some luggage to the man", "Deposit her cash at the counter", "Go to her hotel suite"],
    answer: "B"
  },

  // Q68-70
  {
    id: 208,
    part: 3,
    set: 3,
    conversation: "M: Cindy, I really need your agenda for the conference. If we don't send the information to the printers by 4 P.M., they won't be ready in time.\nW: Sorry, I was totally distracted by the managers' meeting this morning. I will send you my final copy by 3 P.M.\nM: Thanks, did I miss anything important at the morning meeting? I was at the dentist this morning.\nW: We went over budget for the next quarter. Also, we are supposed to come up with ideas to cut 5% off our expenses for the rest of the year for next week's meeting.",
    question: "What does the man need?",
    options: ["An outline for a meeting", "A revenue report", "A fax machine", "A medical record"],
    answer: "A"
  },
  {
    id: 209,
    part: 3,
    set: 3,
    conversation: "M: Cindy, I really need your agenda for the conference. If we don't send the information to the printers by 4 P.M., they won't be ready in time.\nW: Sorry, I was totally distracted by the managers' meeting this morning. I will send you my final copy by 3 P.M.\nM: Thanks, did I miss anything important at the morning meeting? I was at the dentist this morning.\nW: We went over budget for the next quarter. Also, we are supposed to come up with ideas to cut 5% off our expenses for the rest of the year for next week's meeting.",
    question: "Who most likely is the woman?",
    options: ["A print shop employee", "A department manager", "A dental assistant", "A financial auditor"],
    answer: "B"
  },
  {
    id: 210,
    part: 3,
    set: 3,
    conversation: "M: Cindy, I really need your agenda for the conference. If we don't send the information to the printers by 4 P.M., they won't be ready in time.\nW: Sorry, I was totally distracted by the managers' meeting this morning. I will send you my final copy by 3 P.M.\nM: Thanks, did I miss anything important at the morning meeting? I was at the dentist this morning.\nW: We went over budget for the next quarter. Also, we are supposed to come up with ideas to cut 5% off our expenses for the rest of the year for next week's meeting.",
    question: "What are the speakers supposed to do for next week's meeting?",
    options: ["Reschedule a dentist appointment", "Print some flyers for a client", "Think of budget reduction ideas", "Audit last year's corporate tax logs"],
    answer: "C"
  }
];

export default questions;
