export function createQuestions(num: number) {
  const questions = [];
  const template = {
    id: "_id",
    title: "some title",
    answer: `this is my drawing of P tree, which demonstrates no matter how many thousands of P
    there maybe you'll never reach complete silence. This is my current definition of silence, a very obsure sound.`,
    // videoUrl: "/video.mp4",
    videoUrl: "http://localhost:4321/video/1752907927727.mp4",
  };

  for (let i = 0; i < num; i++) {
    questions.push({
      ...template,
      id: `${template.id}-${i + 1}`,
    });
  }

  return questions;
}
