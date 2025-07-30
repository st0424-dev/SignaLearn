
## Technical Writeup (Unsubmitted)

  

## System

Macbook Pro M2 Variant 16gb

  

## Stack

![](https://www.googleapis.com/download/storage/v1/b/kaggle-user-content/o/inbox%2F28105478%2Ff0715f6952c82cd1a6b0a63f8193c655%2FOverall%20Architecture.png?generation=1753861873325077&alt=media)



### Ollama

In order to develop something with Gemma3n, I need to get it in my system locally since the new MPS backend is still in nightly build of Pytorch, I got very poor performance with Hugging Face Platform. It was hard to configure, and accelerator also didn’t have much effect on my device.

  

I tried with Ollama, which comes already with GPU acceleration on Mac hardware, i found the responses quick and snapy, and I decided to go with this instead of Hugging Face

  
I am using the `gemma3n:e4b` for this hackathon

  

### NextJS + Genkit

I decided to test the gemma3n features combined with Genkit powers such as streaming, making typesafe flow and easy integration with Nextjs as discussed in examples.genkit.dev. It was easy and since im new to this field, I thought this can be a good headstart.

  

### Express

This is used in creating the backend of the ssr app, its responsible for basic CRUD stuff with MongoDb along with formatting videos with ffmpeg to feed in the gemma3n for processing.

Mainly i used it for extracting frames from the video, but then in order to save time and manage less services by my own, I decided to just go with it. It also acts a driver of Nodemailer to send your email, manage the admin logic.

  

Our application is a game that lets you [Learn American Sign Language]([https://www.lifeprint.com](https://www.lifeprint.com)) interactively with Gemma. Let start from the game itself, and how it works under the hood.

  



  

## Features

  

### Game Interface

First, we will start with this panel. The user is prompted to provide input based on the video displayed. They are expected to identify the ASL language shown in the video and click the submit button once they are confident in their answer.

![](https://www.googleapis.com/download/storage/v1/b/kaggle-user-content/o/inbox%2F28105478%2F592ab0372eec5d280209a84997df4977%2FGame%20panel.png?generation=1753819817476242&alt=media)

  

- User Answer Submission Flow

- When the user submits their answer, a Next.js server action handles the request.

- The server action fetches the correct answer from the MongoDB cluster via backend queries.

- Both the user’s answer and the correct answer are then passed to a **gemma3n AI flow**.

- This AI flow checks the similarity between the two answers, leveraging gemma3n’s language understanding capabilities.

- Based on the similarity score:

- If the user’s answer passes the threshold, the server returns a success response indicating they cleared the level.

- If the user’s answer falls short, the server responds with feedback describing how close the user’s answer was to the correct one, helping guide improvement.

  

![](https://www.googleapis.com/download/storage/v1/b/kaggle-user-content/o/inbox%2F28105478%2F3a11d89d123c0762b058ebc232dba4ed%2FGame%20Panel%20Architecture.png?generation=1753819869357198&alt=media)

  

- Hint Generation Flow

- When the user requests a hint or gives a hint-related input, a separate Next.js server action is triggered.

- This server action calls `hintsFlowGenerator()`, passing the current question as input.

- The `hintsFlowGenerator()` function generates helpful hints based on the question context by leveraging gemma3n or other AI logic.

- The generated hints are returned to the frontend and displayed to assist the user in making a better guess.

- This flow helps users without directly revealing answers and encourages learning through guided assistance.

  

### Improve the game with help of community

I welcome contributions from community members to expand my question bank. By collaborating together, I can offer users a richer and more diverse learning experience.

![](https://www.googleapis.com/download/storage/v1/b/kaggle-user-content/o/inbox%2F28105478%2F8f3c9c28feffb4caa815a654fc015802%2FContribute%20to%20the%20community.png?generation=1753820033903522&alt=media)

  

- User-Submitted Video Question Feature

- Allows users to add questions to the community by uploading a video.

- Uploaded videos are received and processed by an **Express.js** server.

- Validation and processing steps include:

- Confirming the uploaded file is a valid video format (e.g., `.webm`, `.mp4`) or have the codec type `===` video

- Verifying the video duration is less than 30 seconds.

- Converting the video into individual frames using **FFmpeg** or similar tools.

- Analyzing the extracted frames to check if the content is relevant to American Sign Language (ASL) and not NSFW too.

- Once all checks and processing are completed, the video and related metadata — along with AI-based validations — are forwarded to the **admin portal** for review and further action.

  

![](https://www.googleapis.com/download/storage/v1/b/kaggle-user-content/o/inbox%2F28105478%2F9ab49b0c0beedfbadb56cb222b5d9972%2FContribute%20to%20the%20Community%20Architecture.png?generation=1753820351116158&alt=media)

  

### Admin Panel

The admin panel is designed to review and approve questions submitted by community members. It provides a streamlined interface for admins to view uploaded videos, metadata, and AI validation results. Moderators can accept, reject, or request revisions for submitted questions.

  

![](https://www.googleapis.com/download/storage/v1/b/kaggle-user-content/o/inbox%2F28105478%2F270f7d12bed0a4f0964277ed7989ea2b%2FAdmin%20Panel.png?generation=1753821677515712&alt=media)

  

- The admin panel displays AI validation results for questions submitted in the community section.

- Admins use these AI validation results to decide whether to approve or discard questions.

- User details are also shown if provided during question submission, aiding the approval process.

- When approving a question, admins can use an AI-powered feature to compose and send an email notification to the user.

- Alternatively, admins can choose to silently discard a question without notifying the user.

  

![](https://www.googleapis.com/download/storage/v1/b/kaggle-user-content/o/inbox%2F28105478%2F230cae9e003475aaf39afdd84a4fa54d%2FAdmin%20Panel%20Architecture.png?generation=1753822173109793&alt=media)
