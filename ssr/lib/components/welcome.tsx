"use client";

import { Gamepad2 } from "lucide-react";
import { useState } from "react";

export function Welcome() {
  const [startGame, setStartGame] = useState(false);

  return (
    !startGame && (
      <div className="fixed flex justify-center items-center inset-0 backdrop-blur-sm z-10">
        <div className="w-170 p-10 bg-base-200 text-base-content">
          <h2 className="text-2xl mb-5">Hi Learner!</h2>
          <p>
            Get ready to practice your ASL skills! You&#39;ll watch a short
            video clip (10-30 seconds) and we&#39;ll challenge you to translate
            what you see into English.
          </p>
          <p className="mt-1">
            Gemma3n is here to help! It understands your responses and will let
            you know if you&#39;re on the right track. Don&#39;t hesitate to ask
            for hints if you get stuck.
          </p>
          <p className="mt-2">Happy learning!</p>
          <button
            onClick={() => setStartGame(true)}
            className="btn btn-primary mt-10"
          >
            Start Playing <Gamepad2 />
          </button>
        </div>
      </div>
    )
  );
}
