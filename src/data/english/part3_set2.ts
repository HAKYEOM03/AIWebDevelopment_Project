import { Question } from "./types";

const questions: Question[] = [
  // Q41-43
  {
    id: 151,
    part: 3,
    set: 2,
    conversation: "M: Joan, have you seen the length of the line in the cafeteria? They only have one cashier working today. We'll have to wait a long time to buy our lunch.\nW: I don't really want to wait a long time, do you? How about going to the Mexican food cart down the street instead?\nM: That's a good idea. That cart is quite cheap, too. Oh, but I forgot – I don't have any cash on me today. Do you think they take cards?\nW: I doubt it. Don't worry, though, I can lend you some money.",
    question: "What problem does the man mention?",
    options: ["A waiting time is long.", "A cashier is unavailable.", "Some food is out of stock.", "The street sign is removed."],
    answer: "A"
  },
  {
    id: 152,
    part: 3,
    set: 2,
    conversation: "M: Joan, have you seen the length of the line in the cafeteria? They only have one cashier working today. We'll have to wait a long time to buy our lunch.\nW: I don't really want to wait a long time, do you? How about going to the Mexican food cart down the street instead?\nM: That's a good idea. That cart is quite cheap, too. Oh, but I forgot – I don't have any cash on me today. Do you think they take cards?\nW: I doubt it. Don't worry, though, I can lend you some money.",
    question: "What does the man ask about?",
    options: ["Opening times", "Contact details", "Menu items", "Payment methods"],
    answer: "D"
  },
  {
    id: 153,
    part: 3,
    set: 2,
    conversation: "M: Joan, have you seen the length of the line in the cafeteria? They only have one cashier working today. We'll have to wait a long time to buy our lunch.\nW: I don't really want to wait a long time, do you? How about going to the Mexican food cart down the street instead?\nM: That's a good idea. That cart is quite cheap, too. Oh, but I forgot – I don't have any cash on me today. Do you think they take cards?\nW: I doubt it. Don't worry, though, I can lend you some money.",
    question: "What will the woman probably do next?",
    options: ["Arrange a meeting", "Check a bank card", "Provide the man with some money", "Go back to the cafeteria"],
    answer: "C"
  },

  // Q44-46
  {
    id: 154,
    part: 3,
    set: 2,
    conversation: "W: Good afternoon. I have an appointment for a dental checkup next Tuesday at 4 P.M. with Dr. Miller. I'm calling because I need to change that date if possible.\nM: Let me check the schedule... Yes, that's fine. Dr. Miller is available on Thursday at 10 A.M. or Friday at 2 P.M. next week.\nW: Thursday at 10 A.M. sounds great. I'll take that slot. Will I need to fill out any new forms when I come in?\nM: No, since you've been here before, your records are up to date. Just bring your insurance card with you.",
    question: "Why is the woman calling?",
    options: ["To schedule a surgery", "To cancel a prescription", "To alter an appointment date", "To ask for an invoice"],
    answer: "C"
  },
  {
    id: 155,
    part: 3,
    set: 2,
    conversation: "W: Good afternoon. I have an appointment for a dental checkup next Tuesday at 4 P.M. with Dr. Miller. I'm calling because I need to change that date if possible.\nM: Let me check the schedule... Yes, that's fine. Dr. Miller is available on Thursday at 10 A.M. or Friday at 2 P.M. next week.\nW: Thursday at 10 A.M. sounds great. I'll take that slot. Will I need to fill out any new forms when I come in?\nM: No, since you've been here before, your records are up to date. Just bring your insurance card with you.",
    question: "When is the new appointment made for?",
    options: ["Tuesday at 4 P.M.", "Thursday at 10 A.M.", "Friday at 2 P.M.", "Thursday at 4 P.M."],
    answer: "B"
  },
  {
    id: 156,
    part: 3,
    set: 2,
    conversation: "W: Good afternoon. I have an appointment for a dental checkup next Tuesday at 4 P.M. with Dr. Miller. I'm calling because I need to change that date if possible.\nM: Let me check the schedule... Yes, that's fine. Dr. Miller is available on Thursday at 10 A.M. or Friday at 2 P.M. next week.\nW: Thursday at 10 A.M. sounds great. I'll take that slot. Will I need to fill out any new forms when I come in?\nM: No, since you've been here before, your records are up to date. Just bring your insurance card with you.",
    question: "What is the woman instructed to bring?",
    options: ["An ID badge", "A medical history form", "An insurance card", "A referral letter"],
    answer: "C"
  },

  // Q47-49
  {
    id: 157,
    part: 3,
    set: 2,
    conversation: "M: Excuse me, I was looking at the jacket on the mannequin near the storefront. Do you have it in a size medium? I only see small and large on the rack.\nW: Let me check the back room for you. That particular brand has been selling out really fast since the promotion started.\nM: Thank you. If you don't have a medium, could you check if any of your other branches nearby have it in stock?\nW: Sure thing. If it's available elsewhere, I can order it for you, and it will arrive at our store by Friday morning.",
    question: "Where most likely are the speakers?",
    options: ["In a clothing store", "In a tailor shop", "In a warehouse", "In a dry cleaner"],
    answer: "A"
  },
  {
    id: 158,
    part: 3,
    set: 2,
    conversation: "M: Excuse me, I was looking at the jacket on the mannequin near the storefront. Do you have it in a size medium? I only see small and large on the rack.\nW: Let me check the back room for you. That particular brand has been selling out really fast since the promotion started.\nM: Thank you. If you don't have a medium, could you check if any of your other branches nearby have it in stock?\nW: Sure thing. If it's available elsewhere, I can order it for you, and it will arrive at our store by Friday morning.",
    question: "What size does the man require?",
    options: ["Small", "Medium", "Large", "Extra Large"],
    answer: "B"
  },
  {
    id: 159,
    part: 3,
    set: 2,
    conversation: "M: Excuse me, I was looking at the jacket on the mannequin near the storefront. Do you have it in a size medium? I only see small and large on the rack.\nW: Let me check the back room for you. That particular brand has been selling out really fast since the promotion started.\nM: Thank you. If you don't have a medium, could you check if any of your other branches nearby have it in stock?\nW: Sure thing. If it's available elsewhere, I can order it for you, and it will arrive at our store by Friday morning.",
    question: "What does the woman offer to do if the item is at another branch?",
    options: ["Give him a special discount coupon", "Order it to arrive by Friday", "Call a manager for assistance", "Hold the large size for him"],
    answer: "B"
  },

  // Q50-52
  {
    id: 160,
    part: 3,
    set: 2,
    conversation: "W: Good morning, sir. I'm a representative from World Travel Magazine. We are currently offering a three-month free subscription to new readers.\nM: That sounds interesting, but I usually read all my magazines on my tablet. Do you have a digital version available under this offer?\nW: Yes, absolutely! The free trial includes access to our mobile app and website, so you can read all articles on the go.\nM: Wonderful. What information do I need to provide to sign up for this trial?",
    question: "What business is the woman representing?",
    options: ["A travel agency", "A software company", "A magazine publisher", "A mobile network operator"],
    answer: "C"
  },
  {
    id: 161,
    part: 3,
    set: 2,
    conversation: "W: Good morning, sir. I'm a representative from World Travel Magazine. We are currently offering a three-month free subscription to new readers.\nM: That sounds interesting, but I usually read all my magazines on my tablet. Do you have a digital version available under this offer?\nW: Yes, absolutely! The free trial includes access to our mobile app and website, so you can read all articles on the go.\nM: Wonderful. What information do I need to provide to sign up for this trial?",
    question: "What preference does the man express?",
    options: ["Reading on a digital tablet", "Receiving paper copies by mail", "Subscribing for a full year", "Traveling to new destinations"],
    answer: "A"
  },
  {
    id: 162,
    part: 3,
    set: 2,
    conversation: "W: Good morning, sir. I'm a representative from World Travel Magazine. We are currently offering a three-month free subscription to new readers.\nM: That sounds interesting, but I usually read all my magazines on my tablet. Do you have a digital version available under this offer?\nW: Yes, absolutely! The free trial includes access to our mobile app and website, so you can read all articles on the go.\nM: Wonderful. What information do I need to provide to sign up for this trial?",
    question: "What is the duration of the free trial?",
    options: ["One month", "Two months", "Three months", "Six months"],
    answer: "C"
  },

  // Q53-55
  {
    id: 163,
    part: 3,
    set: 2,
    conversation: "M: Hi, Helen. Have you finalized the budget for our upcoming corporate conference? The catering company needs a deposit by tomorrow.\nW: I'm almost done, but I'm still waiting for the AV equipment rental quote. They said they would email it to me by noon today.\nM: Okay, let's meet at 2 P.M. to review the final numbers. We can't afford to miss the deadline for the caterer, or we might lose the reservation.\nW: Agreed. I'll make sure to call the AV company if I don't see the email in the next hour.",
    question: "What are the speakers preparing the budget for?",
    options: ["A holiday party", "A corporate conference", "A product launch event", "A staff training workshop"],
    answer: "B"
  },
  {
    id: 164,
    part: 3,
    set: 2,
    conversation: "M: Hi, Helen. Have you finalized the budget for our upcoming corporate conference? The catering company needs a deposit by tomorrow.\nW: I'm almost done, but I'm still waiting for the AV equipment rental quote. They said they would email it to me by noon today.\nM: Okay, let's meet at 2 P.M. to review the final numbers. We can't afford to miss the deadline for the caterer, or we might lose the reservation.\nW: Agreed. I'll make sure to call the AV company if I don't see the email in the next hour.",
    question: "What information is Helen waiting for?",
    options: ["The guest list confirmation", "The menu selection from the caterer", "An AV equipment rental quote", "The hotel room availability"],
    answer: "C"
  },
  {
    id: 165,
    part: 3,
    set: 2,
    conversation: "M: Hi, Helen. Have you finalized the budget for our upcoming corporate conference? The catering company needs a deposit by tomorrow.\nW: I'm almost done, but I'm still waiting for the AV equipment rental quote. They said they would email it to me by noon today.\nM: Okay, let's meet at 2 P.M. to review the final numbers. We can't afford to miss the deadline for the caterer, or we might lose the reservation.\nW: Agreed. I'll make sure to call the AV company if I don't see the email in the next hour.",
    question: "When are the speakers planning to meet?",
    options: ["At noon today", "At 2 P.M. today", "Tomorrow morning", "This Friday"],
    answer: "B"
  },

  // Q56-58
  {
    id: 166,
    part: 3,
    set: 2,
    conversation: "W: Tom, did you see the announcement about the office relocation? We're moving to the downtown office building next month.\nM: Yes, I read it this morning. It's going to make my commute much longer, but the new building has great facilities like an indoor gym and cafeteria.\nW: That's true. Plus, we'll be closer to our main clients. Management mentioned they will provide packing boxes starting next week.\nM: Good. I have a lot of reference files and books to pack. I better start sorting through my desk drawer tomorrow.",
    question: "What event are the speakers discussing?",
    options: ["A company merger", "An office relocation", "An annual renovation", "An office party"],
    answer: "B"
  },
  {
    id: 167,
    part: 3,
    set: 2,
    conversation: "W: Tom, did you see the announcement about the office relocation? We're moving to the downtown office building next month.\nM: Yes, I read it this morning. It's going to make my commute much longer, but the new building has great facilities like an indoor gym and cafeteria.\nW: That's true. Plus, we'll be closer to our main clients. Management mentioned they will provide packing boxes starting next week.\nM: Good. I have a lot of reference files and books to pack. I better start sorting through my desk drawer tomorrow.",
    question: "What concern does the man raise about the move?",
    options: ["The high cost of moving", "A longer daily commute", "A lack of packing materials", "Small desk spaces"],
    answer: "B"
  },
  {
    id: 168,
    part: 3,
    set: 2,
    conversation: "W: Tom, did you see the announcement about the office relocation? We're moving to the downtown office building next month.\nM: Yes, I read it this morning. It's going to make my commute much longer, but the new building has great facilities like an indoor gym and cafeteria.\nW: That's true. Plus, we'll be closer to our main clients. Management mentioned they will provide packing boxes starting next week.\nM: Good. I have a lot of reference files and books to pack. I better start sorting through my desk drawer tomorrow.",
    question: "What will management provide next week?",
    options: ["Commuter passes", "New office chairs", "Packing boxes", "Gym memberships"],
    answer: "C"
  },

  // Q59-61
  {
    id: 169,
    part: 3,
    set: 2,
    conversation: "M: Hi, Rachel. Are you going to the web development workshop this afternoon? I heard a guest speaker from TechCorp is leading it.\nW: I really wanted to go, but I have a client presentation at 3 P.M., which overlaps with the workshop. I have to stay and prepare the slides.\nM: That's too bad. I can take detailed notes and pick up any handouts for you if you'd like.\nW: That would be incredibly helpful, Sam! Could you also ask if they will upload a recorded video of the session online?",
    question: "Why can't Rachel attend the workshop?",
    options: ["She is on a business trip.", "She has a client presentation.", "She is feeling sick.", "She missed the registration deadline."],
    answer: "B"
  },
  {
    id: 170,
    part: 3,
    set: 2,
    conversation: "M: Hi, Rachel. Are you going to the web development workshop this afternoon? I heard a guest speaker from TechCorp is leading it.\nW: I really wanted to go, but I have a client presentation at 3 P.M., which overlaps with the workshop. I have to stay and prepare the slides.\nM: That's too bad. I can take detailed notes and pick up any handouts for you if you'd like.\nW: That would be incredibly helpful, Sam! Could you also ask if they will upload a recorded video of the session online?",
    question: "What does Sam offer to do for Rachel?",
    options: ["Help her prepare slides", "Take notes and collect handouts", "Reschedule her presentation", "Record the session on his phone"],
    answer: "B"
  },
  {
    id: 171,
    part: 3,
    set: 2,
    conversation: "M: Hi, Rachel. Are you going to the web development workshop this afternoon? I heard a guest speaker from TechCorp is leading it.\nW: I really wanted to go, but I have a client presentation at 3 P.M., which overlaps with the workshop. I have to stay and prepare the slides.\nM: That's too bad. I can take detailed notes and pick up any handouts for you if you'd like.\nW: That would be incredibly helpful, Sam! Could you also ask if they will upload a recorded video of the session online?",
    question: "What extra information does Rachel want Sam to check?",
    options: ["The price of the next workshop", "The speaker's contact details", "The availability of an online recording", "A certificate of attendance"],
    answer: "C"
  },

  // Q62-64
  {
    id: 172,
    part: 3,
    set: 2,
    conversation: "W: Excuse me, I bought this blender yesterday, but when I tried to use it this morning, the motor wouldn't turn on at all.\nM: I'm sorry about that, ma'am. Let me see... It might be a defective unit. Do you have your receipt with you?\nW: Yes, here it is. I'd prefer a full refund rather than a replacement, as I bought a different model from another store this morning.\nM: No problem. Since it's within 30 days and you have the receipt, I can process a refund back to your credit card immediately.",
    question: "What product is defective?",
    options: ["A coffee maker", "A blender", "A toaster", "A microwave"],
    answer: "B"
  },
  {
    id: 173,
    part: 3,
    set: 2,
    conversation: "W: Excuse me, I bought this blender yesterday, but when I tried to use it this morning, the motor wouldn't turn on at all.\nM: I'm sorry about that, ma'am. Let me see... It might be a defective unit. Do you have your receipt with you?\nW: Yes, here it is. I'd prefer a full refund rather than a replacement, as I bought a different model from another store this morning.\nM: No problem. Since it's within 30 days and you have the receipt, I can process a refund back to your credit card immediately.",
    question: "What option does the woman request?",
    options: ["A product replacement", "A store credit voucher", "A full refund", "A free repair service"],
    answer: "C"
  },
  {
    id: 174,
    part: 3,
    set: 2,
    conversation: "W: Excuse me, I bought this blender yesterday, but when I tried to use it this morning, the motor wouldn't turn on at all.\nM: I'm sorry about that, ma'am. Let see... It might be a defective unit. Do you have your receipt with you?\nW: Yes, here it is. I'd prefer a full refund rather than a replacement, as I bought a different model from another store this morning.\nM: No problem. Since it's within 30 days and you have the receipt, I can process a refund back to your credit card immediately.",
    question: "How will the money be returned?",
    options: ["In cash", "As a gift card", "Back to her credit card", "By mail check"],
    answer: "C"
  },

  // Q65-67
  {
    id: 175,
    part: 3,
    set: 2,
    conversation: "M: Hi, Linda. I noticed that the training session for the new database software has been rescheduled. Is it because the room wasn't available?\nW: Actually, it's because the trainer from the software company is running late. His flight was delayed due to heavy fog.\nM: Ah, I see. What time will the session start now? I need to know if I should cover the reception desk for a bit longer.\nW: It's moved from 1 P.M. to 3 P.M. If you could stay at the desk until then, that would be wonderful. I'll let the manager know.",
    question: "Why was the training session rescheduled?",
    options: ["The training room was locked.", "The database software crashed.", "The trainer's flight was delayed.", "The session had too many participants."],
    answer: "C"
  },
  {
    id: 176,
    part: 3,
    set: 2,
    conversation: "M: Hi, Linda. I noticed that the training session for the new database software has been rescheduled. Is it because the room wasn't available?\nW: Actually, it's because the trainer from the software company is running late. His flight was delayed due to heavy fog.\nM: Ah, I see. What time will the session start now? I need to know if I should cover the reception desk for a bit longer.\nW: It's moved from 1 P.M. to 3 P.M. If you could stay at the desk until then, that would be wonderful. I'll let the manager know.",
    question: "What is the new start time for the session?",
    options: ["1 P.M.", "2 P.M.", "3 P.M.", "4 P.M."],
    answer: "C"
  },
  {
    id: 177,
    part: 3,
    set: 2,
    conversation: "M: Hi, Linda. I noticed that the training session for the new database software has been rescheduled. Is it because the room wasn't available?\nW: Actually, it's because the trainer from the software company is running late. His flight was delayed due to heavy fog.\nM: Ah, I see. What time will the session start now? I need to know if I should cover the reception desk for a bit longer.\nW: It's moved from 1 P.M. to 3 P.M. If you could stay at the desk until then, that would be wonderful. I'll let the manager know.",
    question: "What does the man suggest doing?",
    options: ["Attending a sports event", "Having a meeting with a client", "Speaking to a tech trainer", "Covering a reception desk longer"],
    answer: "D"
  },

  // Q68-70
  {
    id: 178,
    part: 3,
    set: 2,
    conversation: "W: Do you have a moment, Frank? I've been working on the resourcing plan for next month, and I noticed that Jessica is going to be on vacation in the final week. Would you be interested in taking on some of her shifts on the production line?\nM: Yes, I could do with the extra hours. Will I be paid at my regular rate, or will I get overtime pay?\nW: You'll get the overtime rate, but remember that I have to approve the time worked as overtime. So make sure you get me to sign your timesheet for you before you submit it.",
    question: "Where most likely do the speakers work?",
    options: ["In a college", "In an office", "In a factory", "In a bank"],
    answer: "C"
  },
  {
    id: 179,
    part: 3,
    set: 2,
    conversation: "W: Do you have a moment, Frank? I've been working on the resourcing plan for next month, and I noticed that Jessica is going to be on vacation in the final week. Would you be interested in taking on some of her shifts on the production line?\nM: Yes, I could do with the extra hours. Will I be paid at my regular rate, or will I get overtime pay?\nW: You'll get the overtime rate, but remember that I have to approve the time worked as overtime. So make sure you get me to sign your timesheet for you before you submit it.",
    question: "What does the man ask about?",
    options: ["The name of a coworker", "The rate of pay", "The vacation schedule", "The location of an item"],
    answer: "B"
  },
  {
    id: 180,
    part: 3,
    set: 2,
    conversation: "W: Do you have a moment, Frank? I've been working on the resourcing plan for next month, and I noticed that Jessica is going to be on vacation in the final week. Would you be interested in taking on some of her shifts on the production line?\nM: Yes, I could do with the extra hours. Will I be paid at my regular rate, or will I get overtime pay?\nW: You'll get the overtime rate, but remember that I have to approve the time worked as overtime. So make sure you get me to sign your timesheet for you before you submit it.",
    question: "What is the man instructed to do before submitting his timesheet?",
    options: ["Get the woman's signature", "Contact Human Resources", "Resubmit last week's log", "Check with Jessica"],
    answer: "A"
  }
];

export default questions;
