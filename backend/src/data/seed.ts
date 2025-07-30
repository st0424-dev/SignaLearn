import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

import type { PendingQuestion, Question } from "./questions.js";

import { env } from "../env.js";
import { database } from "./mongo.js";

function createSeededQues(answer: string, title: string, filename: string): Question {
  return {
    id: nanoid(),
    answer,
    title,
    videoUrl: `http://localhost:${env.PORT}/uploads/${filename}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
  };
}

function createSeededPendingQues(answer: string, title: string, filename: string, ai_desc: string, ai_title: string): PendingQuestion {
  return {
    question: { ...createSeededQues(answer, title, filename), name: "shahil", email: "shahil@email.com" },
    ai_results: {
      description: ai_desc,
      title: ai_title,
      flag: true,
    },
  };
}

async function bulkInsertPendingQuestionsInTheDb() {
  const collection = database.collection<PendingQuestion>("pending");

  await collection.insertMany([
    createSeededPendingQues(
      "Now here’s the deal: okra gets a bad rap for being slimy. But there’s actually a reason for that. That mucilage—it’s the thick, gooey stuff—is amazing for thickening soups and stews. Gumbo wouldn’t be gumbo without it.",
      "A garden with sunlight filtering through leaves",
      "pending_question1.mp4",
      "The submitted video was analyzed for American Sign Language (ASL) content. However, the system detected that the majority of the visual elements consist of animated or cartoon-style content, with no discernible ASL signing or human hand gestures typically associated with sign language communication.This video appears to contain animated content unrelated to ASL. If ASL elements are intended to be present, please ensure they are visually clear, involve human (or realistic) signing, and follow standard ASL grammar structures.",
      "Animated Content Detected – No ASL Signing Present",
    ),

    createSeededPendingQues(
      "And hey, it’s packed with fiber, vitamin C, and folate. Plus, the seeds? Full of antioxidants. So yeah, this little pod packs a punch.",
      "The Okra Family",
      "pending_question2.mp4",
      "Our system analyzed this video and found that it primarily features animated visuals with no recognizable American Sign Language (ASL) signing. Expected ASL elements such as human hand gestures, facial expressions, and signing sequences were not detected. This content has been flagged for review due to a potential mismatch between the intended and actual subject matter.",
      "Content Mismatch Detected: Animation Found Instead of ASL",
    ),

    createSeededPendingQues(
      "“Meet Narwhaldo! The signing sea unicorn who’s here to teach you about underwater taxes and jellybean diplomacy.”If you eat 37 jellybeans in 12 minutes, you become fluent in dolphin sign language. Squeeee!“Narwhaldo will return after these messages from our sponsors: Moon Shoes and Emotional Support Turnips.”",
      "Hahaaa! Prank Prank",
      "pending_question3.mp4",
      "This is a voice-over video tutorial covering key programming concepts step-by-step. The instructor guides viewers through the code with clear explanations, screen-sharing, and live demonstrations. Ideal for beginners and intermediate developers, the video offers hands-on guidance to help you understand syntax, logic, and real-world applications. No on-camera presence—just focused, high-quality narration and code walkthroughs.",
      "Youtube Programming Title",
    ),

    createSeededPendingQues(
      "“Welcome to the world's first JavaScript tutorial taught entirely by a potato in a top hat.” Yes, you heard that right. If you debug code with jazz music playing backwards, it compiles 27% faster. Sources? Trust me, bro. And remember—every time you forget a semicolon, a duck somewhere sheds a tear.",
      "LOL! Potato dev confirmed 🥔",
      "pending_question4.mp4",
      "This is a voice-over programming video where essential JavaScript concepts are explained with clarity and humor. Perfect for beginners, the tutorial covers variables, loops, and functions through interactive examples and voice-guided coding. No facecam—just solid narration, clean code, and a sprinkle of ridiculousness.",
      "JavaScript Basics – With a Side of Potatoes",
    ),

    createSeededPendingQues(
      "For example, this is the sign for day, as the sun rises and sets. This is all day. If I was to repeat it and to slow it down, visually it looks like a piece of music. All day. I feel the same holds true for all. Thank you.",
      "TED: ASL Sign Language Beauty",
      "pending_question5.mp4",
      "A young girl is seen speaking confidently on a TED stage, delivering her message with passion and clarity. Her expressive gestures, poised stance, and articulate speech suggest she is sharing a personal story or an inspiring idea aimed at sparking thought and conversation",
      "TED: Speaker",
    ),

  ]);
}

async function bulkInsertQuestionsInTheDb() {
  const collection = database.collection<Question>("questions");
  await collection.insertMany(
    [
      createSeededQues(`Meaning that subtle changes can infect the entire meaning to both signs and sounds. I'd like to share with you a piano metaphor to have you have a better understanding of how ASL works. So envision a piano. ASL is broken down to many different grammatical parameters. If you assign a different parameter to each finger as you play the piano, such as...`, "The Piano of ASL: How Subtle Changes Shape Meaning in Sign Language", "question1.mp4"),
      createSeededQues(`Facial expression, body movement, speed, hand shape, and so on as you play the piano. English is a linear language, as if one key is being pressed at a time. However, ASL is more like a chord. All ten fingers need to come down simultaneously to express a clear concept or idea in ASL. It's just one of those keys for to change.`, "ASL as a Chord: A Piano Metaphor for Visual Language", "question2.mp4"),
      createSeededQues(`The same applies to music in regards to pitch, tone, and volume. In ASL, by playing around with these different grammatical parameters, you can express different ideas. For example, take the sign to look at. This is the sign to look at. I'm looking at you. I'm staring at you.`, "Expressive Nuance in ASL: A Musical Analogy", "question3.mp4"),
      createSeededQues(`Mm-hmm. Ooh, busted. Uh-oh. What are you looking at? Aw, stop. Everyone started thinking, what if I was to look at ASL through a musical lens? If I was to create a sign and repeat it over and over... Mm-hmm.`, "Seeing ASL Through a Musical Lens: Rhythm, Repetition, and Expression", "question4.mp4"),
    ],
  );
};

async function run() {
  await bulkInsertQuestionsInTheDb();
  console.log("Inserted the questions in the table ✅");

  await bulkInsertPendingQuestionsInTheDb();
  console.log("Inserted the pending questions in the table ✅");
}

run().catch(console.error).finally(() => process.exit(0));
